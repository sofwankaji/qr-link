import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.disable('x-powered-by');
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(root, 'dist')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
  app.get('/', async (req, res, next) => {
    try {
      const { readFile } = await import('node:fs/promises');
      res.type('html').send(await vite.transformIndexHtml(req.url, await readFile(path.join(root, 'index.html'), 'utf8')));
    } catch (error) { next(error); }
  });
}
app.use((_req, res) => res.status(404).type('html').send('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — QR Link</title><body style="font-family:system-ui;background:#f5f5f7;padding:12vh 24px;text-align:center"><h1>Page not found.</h1><a href="/">Create a QR code</a></body></html>'));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
const server = app.listen(process.env.PORT || 3000, host, () => console.log(`QR Link listening on ${host}:${server.address().port}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
