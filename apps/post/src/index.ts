import { Hono } from 'hono';

import { TEST as TESTc } from 'shared-constants/test';
import { TEST as TESTl } from 'shared-libs/test';
import { TEST as TESTu } from 'shared-utils/test';

const app = new Hono();
app.get('/', (c) => c.json({ message: `Hello ${TESTc} ${TESTl} ${TESTu}!` }));

// Start the api
const PORT = Number(process.env.PORT) || 3000;
export default {
  port: PORT,
  fetch: app.fetch,
};
