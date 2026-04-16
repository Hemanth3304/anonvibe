import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger.js';

export const roomService = {
  /**
   * Create a new chat room for two matched strangers
   */
  async createRoom(redis, socketId1, socketId2) {
    const roomId = uuidv4();
    const roomKey = `room:${roomId}`;

    const roomData = {
      id: roomId,
      user1: socketId1,
      user2: socketId2,
      createdAt: Date.now(),
    };

    // Store room metadata in Redis with 24h expiration
    await redis.hSet(roomKey, roomData);
    await redis.expire(roomKey, 86400);

    logger.info(`Room created: ${roomId} [${socketId1} <-> ${socketId2}]`);
    return roomId;
  },

  /**
   * Delete room and cleanup history
   */
  async deleteRoom(redis, roomId) {
    await redis.del(`room:${roomId}`);
    await redis.del(`room:${roomId}:messages`);
    logger.info(`Room deleted: ${roomId}`);
  }
};
