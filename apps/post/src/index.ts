import { Hono } from 'hono';

import { TEST as TESTc } from 'shared-constants/test';
import { TEST as TESTl } from 'shared-libs/test';
import { TEST as TESTu } from 'shared-utils/test';

const PORT = Number(process.env.PORT) || 3001;

const app = new Hono();
app.get('/', (c) => c.json({ message: `Hello Posts!` }));
app.get('/health', (c) => c.json({ status: 'ok' }));
app.get('/test', (c) => c.json({ message: `Hello Test ${TESTc} ${TESTl} ${TESTu}!` }));

console.log(`API Posts running on port ${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
