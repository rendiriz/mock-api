import { Redis } from '@upstash/redis';

export const upstashCache = new Redis({
  url: process.env.UPSTASH_REDIS_CACHE_URL,
  token: process.env.UPSTASH_REDIS_CACHE_TOKEN,
});
