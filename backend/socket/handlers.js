/**
 * Socket.IO Event Handlers
 * Manages: guest sessions, matching queue, text chat,
 *          WebRTC signaling (video), file sharing
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger.js';

// In-memory map of socketId → guestProfile
const guests = new Map();

export function setupSocketHandlers(io, redis, matchingService, roomService) {

  io.on('connection', async (socket) => {
    const guestId = uuidv4();
    logger.info(`Guest connected: ${guestId} (${socket.id})`);

    // Track online count in Redis
    await redis.sAdd('online:users', socket.id);
    io.emit('online:count', await redis.sCard('online:users'));

    // ── 1. REGISTER GUEST ─────────────────────────────────────────
    socket.on('guest:register', async ({ gender, language, interests, mode }) => {
      const profile = {
        socketId: socket.id,
        guestId,
        gender:    gender   || 'unknown',
        language:  (language || 'english').toLowerCase().trim(),
        interests: interests || [],
        mode:      mode || 'text',   // 'text' | 'video' | 'share'
        connectedAt: Date.now(),
        partnerId: null,
        roomId: null,
      };

      guests.set(socket.id, profile);

      // Persist basic stats in Redis
      await redis.hSet(`guest:${socket.id}`, {
        gender:   profile.gender,
        language: profile.language,
        mode:     profile.mode,
      });
      await redis.expire(`guest:${socket.id}`, 3600);

      socket.emit('guest:registered', { guestId });
      logger.info(`Guest registered: ${guestId} | lang=${profile.language} | gender=${profile.gender}`);
    });

    // ── 2. JOIN MATCHING QUEUE ────────────────────────────────────
    socket.on('queue:join', async () => {
      const profile = guests.get(socket.id);
      if (!profile) return socket.emit('error', { message: 'Register first.' });
      if (profile.partnerId) return; // already connected

      const match = await matchingService.findMatch(redis, profile, guests);

      if (match) {
        // Create a room and connect both users
        const roomId = await roomService.createRoom(redis, socket.id, match.socketId);

        // Update both profiles
        guests.get(socket.id).partnerId = match.socketId;
        guests.get(socket.id).roomId    = roomId;
        guests.get(match.socketId).partnerId = socket.id;
        guests.get(match.socketId).roomId    = roomId;

        socket.join(roomId);
        io.sockets.sockets.get(match.socketId)?.join(roomId);

        const payload = {
          roomId,
          partnerGender:   match.gender,
          partnerLanguage: match.language,
          partnerLocation: await getFakeLocation(), // geo approximation
        };

        socket.emit('match:found', payload);
        io.to(match.socketId).emit('match:found', {
          ...payload,
          partnerGender:   profile.gender,
          partnerLanguage: profile.language,
        });

        // Increment room stats
        await redis.incr('stats:total_rooms');
        logger.info(`Room ${roomId}: ${socket.id} ↔ ${match.socketId}`);
      } else {
        // Add to waiting queue
        await matchingService.enqueue(redis, profile);
        socket.emit('queue:waiting', { position: await matchingService.queueLength(redis, profile) });
      }
    });

    // ── 3. TEXT CHAT ──────────────────────────────────────────────
    socket.on('chat:message', async ({ text }) => {
      const profile = guests.get(socket.id);
      if (!profile?.roomId) return;

      // Basic content filter
      const filtered = filterText(text);
      if (!filtered) return;

      const msg = {
        id:        uuidv4(),
        from:      socket.id,
        text:      filtered,
        timestamp: Date.now(),
      };

      // Persist message (capped at last 50 per room)
      await redis.rPush(`room:${profile.roomId}:messages`, JSON.stringify(msg));
      await redis.lTrim(`room:${profile.roomId}:messages`, -50, -1);
      await redis.expire(`room:${profile.roomId}:messages`, 86400);

      // Broadcast to room (sender gets echo too for confirmation)
      io.to(profile.roomId).emit('chat:message', msg);
      await redis.incr('stats:total_messages');
    });

    // ── 4. TYPING INDICATOR ───────────────────────────────────────
    socket.on('chat:typing', ({ typing }) => {
      const profile = guests.get(socket.id);
      if (!profile?.roomId) return;
      socket.to(profile.roomId).emit('chat:typing', { typing });
    });

    // ── 5. WEBRTC SIGNALING (Video/Audio) ─────────────────────────
    // Relay WebRTC SDP offer/answer and ICE candidates between peers
    socket.on('webrtc:offer', ({ sdp }) => {
      const profile = guests.get(socket.id);
      if (!profile?.roomId) return;
      socket.to(profile.roomId).emit('webrtc:offer', { sdp, from: socket.id });
    });

    socket.on('webrtc:answer', ({ sdp }) => {
      const profile = guests.get(socket.id);
      if (!profile?.roomId) return;
      socket.to(profile.roomId).emit('webrtc:answer', { sdp, from: socket.id });
    });

    socket.on('webrtc:ice-candidate', ({ candidate }) => {
      const profile = guests.get(socket.id);
      if (!profile?.roomId) return;
      socket.to(profile.roomId).emit('webrtc:ice-candidate', { candidate, from: socket.id });
    });

    // ── 6. FILE / MEDIA SHARING ───────────────────────────────────
    socket.on('media:share', async ({ fileName, fileType, fileData, fileSize }) => {
      const profile = guests.get(socket.id);
      if (!profile?.roomId) return;

      // Validate file size (max 25MB)
      if (fileSize > 25 * 1024 * 1024) {
        return socket.emit('error', { message: 'File too large (max 25MB).' });
      }

      const allowed = ['image/', 'video/', 'audio/', 'application/pdf'];
      if (!allowed.some(t => fileType.startsWith(t))) {
        return socket.emit('error', { message: 'File type not allowed.' });
      }

      socket.to(profile.roomId).emit('media:share', {
        from:      socket.id,
        fileName,
        fileType,
        fileData,   // base64 — for small files only; large files use S3 presigned URL flow
        fileSize,
        timestamp: Date.now(),
      });

      await redis.incr('stats:total_files');
    });

    // ── 7. NEXT STRANGER ─────────────────────────────────────────
    socket.on('stranger:next', async () => {
      await disconnectFromPartner(socket, redis, io, guests, matchingService);
      // Re-join queue automatically
      socket.emit('queue:searching');
    });

    // ── 8. REPORT USER ───────────────────────────────────────────
    socket.on('user:report', async ({ reason }) => {
      const profile = guests.get(socket.id);
      if (!profile?.partnerId) return;
      await redis.rPush('moderation:reports', JSON.stringify({
        reporter:  socket.id,
        reported:  profile.partnerId,
        reason:    reason || 'unspecified',
        timestamp: Date.now(),
      }));
      socket.emit('report:submitted');
    });

    // ── 9. DISCONNECT ─────────────────────────────────────────────
    socket.on('disconnect', async () => {
      logger.info(`Guest disconnected: ${guestId}`);
      await disconnectFromPartner(socket, redis, io, guests, matchingService);
      guests.delete(socket.id);
      await redis.sRem('online:users', socket.id);
      await redis.del(`guest:${socket.id}`);
      io.emit('online:count', await redis.sCard('online:users'));
    });
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────

async function disconnectFromPartner(socket, redis, io, guests, matchingService) {
  const profile = guests.get(socket.id);
  if (!profile) return;

  // Remove from queue if waiting
  await matchingService.dequeue(redis, profile);

  if (profile.partnerId && profile.roomId) {
    io.to(profile.roomId).emit('stranger:disconnected');

    // Update partner's state
    const partner = guests.get(profile.partnerId);
    if (partner) {
      partner.partnerId = null;
      partner.roomId    = null;
    }

    await redis.del(`room:${profile.roomId}`);
    socket.leave(profile.roomId);

    profile.partnerId = null;
    profile.roomId    = null;
  }
}

const BLOCKED_WORDS = ['spam', 'advertisement']; // extend with proper list
function filterText(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim().slice(0, 2000); // 2k char limit
  if (BLOCKED_WORDS.some(w => trimmed.toLowerCase().includes(w))) return null;
  return trimmed;
}

async function getFakeLocation() {
  const locs = ['Tokyo, JP','London, UK','New York, US','Mumbai, IN','Berlin, DE','Sydney, AU','São Paulo, BR','Lagos, NG'];
  return locs[Math.floor(Math.random() * locs.length)];
}
