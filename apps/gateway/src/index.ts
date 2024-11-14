import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';

import { cacheMiddleware } from './utils/cacheMiddleware';

// Service registry
const services: Record<string, string> = {
  posts: process.env.VI_POST_URL as string,
};

const PORT = Number(process.env.PORT) || 3000;

new Elysia()
  .use(rateLimit())
  .onError(({ code, error }) => {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: code === 'NOT_FOUND' ? 404 : 500 },
    );
  })
  .get('/health', () => ({ status: 'ok' }))
  .all('/:service/*', async ({ params, request }) => {
    const response = await cacheMiddleware(request, async () => {
      const { service } = params;
      const serviceUrl = services[service];

      if (!serviceUrl) {
        return new Response('Service not found', { status: 404 });
      }

      const url = new URL(request.url);
      const targetUrl = `${serviceUrl}${url.pathname.replace(`/${service}`, '')}`;

      try {
        return await fetch(targetUrl, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
      } catch (error) {
        return new Response('Service unavailable', { status: 503 });
      }
    });

    return response;
  })
  .listen(PORT);

console.log(`API Gateway running on port ${PORT}`);
