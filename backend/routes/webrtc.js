import express from 'express';
import { logger } from '../config/logger.js';

const router = express.Router();

router.get('/ice-servers', async (req, res) => {
  try {
    // In a production environment with a real TURN server (like Coturn),
    // you would generate ephemeral credentials here using a shared secret.
    // For now, we return standard public STUN servers and an optional TURN
    // server if configured in the environment.

    // Free STUN servers (Google)
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ];

    // Free TURN servers via Open Relay (metered.ca) — no account needed
    const openRelayTurn = [
      { urls: 'turn:openrelay.metered.ca:80',      username: 'openrelayproject', credential: 'openrelayproject' },
      { urls: 'turn:openrelay.metered.ca:443',     username: 'openrelayproject', credential: 'openrelayproject' },
      { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
    ];

    // Use custom TURN if configured, otherwise fall back to free Open Relay
    if (process.env.TURN_SERVER_URL && process.env.TURN_SERVER_USERNAME && process.env.TURN_SERVER_PASSWORD) {
      iceServers.push({
        urls: process.env.TURN_SERVER_URL,
        username: process.env.TURN_SERVER_USERNAME,
        credential: process.env.TURN_SERVER_PASSWORD,
      });
    } else {
      iceServers.push(...openRelayTurn);
    }

    res.json({ iceServers });
  } catch (error) {
    logger.error(`Error fetching ICE servers: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch ICE configurations' });
  }
});

export { router as webrtcRouter };
