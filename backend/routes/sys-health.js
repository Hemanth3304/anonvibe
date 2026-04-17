import { Router } from 'express';
import { redisClient } from '../server.js';
import { logger } from '../config/logger.js';

export const sysHealthRouter = Router();

// Middleware to check API key/password
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
  }
  
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    req.socket.destroy(); // Hard drop for unauthorized scans to hide it further
    return; 
  }
  next();
};

// All admin routes are protected
sysHealthRouter.use(requireAdminAuth);

/**
 * GET /api/sys-health/reports
 * Fetches all user reports
 */
sysHealthRouter.get('/reports', async (req, res) => {
  try {
    const listCount = await redisClient.lLen('moderation:reports');
    if (listCount === 0) return res.json({ reports: [] });
    
    const records = await redisClient.lRange('moderation:reports', 0, -1);
    const parsed = records.map((r, index) => {
      try {
        return { ...JSON.parse(r), _index: index };
      } catch (e) {
         return { error: 'invalid json', _index: index };
      }
    });

    // Provide some minimal overview stats too
    const activeRooms = await redisClient.sCard('rooms:active');
    const onlineUsers = await redisClient.sCard('online:users');

    res.json({ 
      reports: parsed,
      stats: { activeRooms, onlineUsers }
    });
  } catch (err) {
    logger.error('Failed to parse reports:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /api/sys-health/reports
 * Clears ALL reports. Passing index isn't safe with high concurrency list pushes.
 */
sysHealthRouter.delete('/reports', async (req, res) => {
  try {
    await redisClient.del('moderation:reports');
    res.json({ success: true, message: 'All reports cleared.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to clear' });
  }
});

