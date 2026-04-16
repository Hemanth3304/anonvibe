import dotenv from 'dotenv';
dotenv.config();

export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD, // Add password support
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Retry attempt exhausted');
      return Math.min(retries * 50, 2000);
    },
  },
};
