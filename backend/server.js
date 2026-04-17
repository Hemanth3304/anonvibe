/**
 * StrangerWorld — Backend Server
 * Node.js + Express + Socket.IO + WebRTC Signaling
 * No auth required — fully guest-based, open source
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

import { matchingService } from './services/matchingService.js';
import { roomService }     from './services/roomService.js';
import { mediaRouter }     from './routes/media.js';
import { statsRouter }     from './routes/stats.js';
import { webrtcRouter }    from './routes/webrtc.js';
import { adminRouter }     from './routes/admin.js';
import { setupSocketHandlers } from './socket/handlers.js';
import { logger }          from './config/logger.js';
import { redisConfig }     from './config/redis.js';

const app    = express();
const httpServer = createServer(app);

// ─── REDIS ───────────────────────────────────────────────────────
export let redisClient;
try {
  redisClient = createClient(redisConfig);
  await redisClient.connect();
  logger.info('Redis connected');
} catch (err) {
  logger.warn('Redis connection failed. Falling back to in-memory mock.');
  // Basic mock for local development
  redisClient = {
    sAdd: async () => 1,
    sRem: async () => 1,
    sCard: async () => 1,
    sMembers: async () => [],
    hSet: async () => 1,
    hGet: async () => null,
    del: async () => 1,
    incr: async () => 1,
    expire: async () => 1,
    exists: async () => 0,
    rPush: async () => 1,
    lTrim: async () => 1,
    get: async () => null,
  };
}

// ─── SOCKET.IO ───────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 10 * 1024 * 1024, // 10MB for file transfers
  pingTimeout: 30000,
  pingInterval: 10000,
});

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' },
});
app.use('/api/', limiter);

// ─── REST ROUTES ─────────────────────────────────────────────────
app.use('/api/media', mediaRouter);
app.use('/api/stats', statsRouter);
app.use('/api/webrtc', webrtcRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', async (req, res) => {
  try {
    const isRedisConnected = redisClient.isOpen;
    const onlineCount = isRedisConnected ? await redisClient.sCard('online:users') : 0;
    
    res.json({ 
      status: isRedisConnected ? 'ok' : 'degraded', 
      redis: isRedisConnected ? 'connected' : 'disconnected',
      online: onlineCount, 
      uptime: process.uptime() 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── SOCKET.IO HANDLERS ──────────────────────────────────────────
setupSocketHandlers(io, redisClient, matchingService, roomService);

// ─── START ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`StrangerWorld server running on port ${PORT}`);
});

export { io };
