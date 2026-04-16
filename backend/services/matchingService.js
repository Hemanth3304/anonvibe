/**
 * Matching Service
 * Priority: language match → gender preference → any
 * Uses Redis sorted sets for efficient queue management
 */

export const matchingService = {

  /**
   * Try to find a match for the incoming guest.
   * Priority order:
   *   1. Same language + available in queue
   *   2. Any language + available in queue
   */
  async findMatch(redis, profile, guests) {
    const queueKey = 'queue:waiting';

    // Get all waiting socket IDs
    const waiting = await redis.sMembers(queueKey);
    if (waiting.length === 0) return null;

    let candidates = [];
    let bestScore = -1;

    for (const socketId of waiting) {
      if (socketId === profile.socketId) continue;

      const candidate = guests.get(socketId);
      if (!candidate || candidate.partnerId) continue; 

      let score = 0;
      // Language match (highest priority)
      if (candidate.language === profile.language) score += 10;
      else if (candidate.language === 'any' || profile.language === 'any') score += 5;

      // Mode match
      if (candidate.mode === profile.mode) score += 3;

      // Variety: avoid immediate re-match if possible (optional score penalty)
      // if (profile.lastPartnerId === candidate.socketId) score -= 5;

      if (score > bestScore) {
        bestScore = score;
        candidates = [candidate];
      } else if (score === bestScore && score !== -1) {
        candidates.push(candidate);
      }
    }

    if (candidates.length > 0) {
      // Pick a random candidate from the best matches
      const bestMatch = candidates[Math.floor(Math.random() * candidates.length)];
      
      // Remove from queue
      await redis.sRem(queueKey, bestMatch.socketId);
      return bestMatch;
    }

    return null;
  },

  async enqueue(redis, profile) {
    await redis.sAdd('queue:waiting', profile.socketId);
    await redis.expire('queue:waiting', 300); // auto-expire 5 min
  },

  async dequeue(redis, profile) {
    await redis.sRem('queue:waiting', profile.socketId);
  },

  async queueLength(redis, profile) {
    return await redis.sCard('queue:waiting');
  },
};
