/**
 * Matching Service
 * Priority:
 *   1. Same preference + same mode  (best match)
 *   2. Same preference only
 *   3. Both have no preference + same mode
 *   4. Both have no preference (any mode)
 *   5. If user has a preference but nobody matches — queue and wait
 *      (never force-match across different preferences)
 */

export const matchingService = {

  /**
   * Try to find a match for the incoming guest.
   * Key rule: if a user specifies a preference, ONLY match with the
   * same preference. If no preference, match with anyone who also has
   * no preference (or treat empty as "open").
   */
  async findMatch(redis, profile, guests) {
    const queueKey = 'queue:waiting';

    const waiting = await redis.sMembers(queueKey);
    if (waiting.length === 0) return null;

    const myPref = (profile.preference || '').trim().toLowerCase();

    let bestMatch = null;
    let bestScore = -1;

    for (const socketId of waiting) {
      if (socketId === profile.socketId) continue;

      const candidate = guests.get(socketId);
      if (!candidate || candidate.partnerId) continue;

      const theirPref = (candidate.preference || '').trim().toLowerCase();

      // ── Preference gate ────────────────────────────────────────
      // If either side has a preference, they MUST match.
      if (myPref && theirPref && myPref !== theirPref) continue;   // both set, different → skip
      if (myPref && !theirPref) continue;  // I want a specific topic, they don't → skip
      if (!myPref && theirPref) continue;  // They want a specific topic, I don't → skip
      // ──────────────────────────────────────────────────────────

      let score = 0;

      // Same preference (both filled and equal)
      if (myPref && theirPref && myPref === theirPref) score += 20;

      // Same mode (text/video)
      if (candidate.mode === profile.mode) score += 5;

      // Prefer candidates who have been waiting longer
      // (socketId prefix is just a tie-breaker here)
      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    }

    if (bestMatch) {
      await redis.sRem(queueKey, bestMatch.socketId);
      return bestMatch;
    }

    return null;
  },

  async enqueue(redis, profile) {
    await redis.sAdd('queue:waiting', profile.socketId);
    await redis.expire('queue:waiting', 600); // auto-expire 10 min
  },

  async dequeue(redis, profile) {
    await redis.sRem('queue:waiting', profile.socketId);
  },

  async queueLength(redis, profile) {
    return await redis.sCard('queue:waiting');
  },
};
