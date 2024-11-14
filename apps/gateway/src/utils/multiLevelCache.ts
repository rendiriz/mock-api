import { postgresCache } from '../libs/postgresCache.ts';
import { upstashCache } from '../libs/upstashCache.ts';

export const multiLevelCache = {
  async get(key: string) {
    // Try Redis first (L1 cache)
    const redisResult = await upstashCache.get(key);
    if (redisResult) return redisResult;

    // Try Postgres (L2 cache)
    const pgResult = await postgresCache.get(key);
    if (pgResult) {
      // Populate Redis cache for future requests
      await upstashCache.set(key, pgResult, { ex: 60 });
      return pgResult;
    }

    return null;
  },

  async set(key: string, value: any) {
    // Store in both caches
    await Promise.all([
      upstashCache.set(key, value, { ex: 60 }), // 60s TTL for Redis
      postgresCache.set(key, value, 3600000), // 1 hour TTL for Postgres
    ]);
  },
};
