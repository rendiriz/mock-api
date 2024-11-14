import cors from 'cors';
import gateway from 'fast-gateway';
import helmet from 'helmet';

// Initialize gateway
const server = gateway({
  middlewares: [cors(), helmet()],
  routes: [
    {
      prefix: '/posts',
      target: process.env.VI_POST_URL as string,
    },
  ],
});

// Start the gateway
const PORT = Number(process.env.PORT) || 3000;
server.start(PORT).then(() => {
  console.log(`API Gateway running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gateway...');
  await server.close();
  process.exit(0);
});
