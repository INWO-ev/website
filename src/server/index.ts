import 'dotenv/config';
import { buildApp } from './app.js';

const PORT = Number(process.env.PORT ?? 3011);
const HOST = process.env.HOST ?? '0.0.0.0';

const app = buildApp();

app
  .listen({ port: PORT, host: HOST })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`INWO landing page listening on http://${HOST}:${PORT}`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
