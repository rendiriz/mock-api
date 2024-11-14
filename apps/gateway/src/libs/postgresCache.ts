import KeyvPostgres from '@keyv/postgres';
import { Keyv } from 'keyv';

export const postgresCache = new Keyv({
  store: new KeyvPostgres({
    uri: process.env.POSTGRES_CACHE_URL,
    table: 'cache',
    schema: 'public',
  }),
  ttl: 3600000,
});
