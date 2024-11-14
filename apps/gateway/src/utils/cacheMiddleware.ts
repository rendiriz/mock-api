import { multiLevelCache } from './multiLevelCache';

export const cacheMiddleware = async (request: Request, next: Function) => {
  if (request.method !== 'GET') return next();

  const cacheKey = request.url;
  const cached = await multiLevelCache.get(cacheKey);

  if (cached) {
    return new Response(cached.body, {
      headers: cached.headers,
      status: cached.status,
    });
  }

  const response = await next();
  const clonedResponse = response.clone();

  const cached_response = {
    body: await clonedResponse.text(),
    headers: Object.fromEntries(clonedResponse.headers),
    status: clonedResponse.status,
  };

  await multiLevelCache.set(cacheKey, cached_response);
  return response;
};
