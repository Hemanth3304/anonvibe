import express from 'express';
import { redisClient } from '../server.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const totalMessages = await redisClient.get('stats:total_messages') || 0;
    const totalRooms = await redisClient.get('stats:total_rooms') || 0;
    const onlineUsers = await redisClient.sCard('online:users') || 0;

    res.json({
      onlineUsers: parseInt(onlineUsers),
      totalMatches: parseInt(totalRooms),
      messagesSent: parseInt(totalMessages),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export { router as statsRouter };
