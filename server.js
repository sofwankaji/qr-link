import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import { randomInt, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeUrl } from './src/url.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const databasePath = process.env.DB_PATH || path.join(root, 'data', 'links.sqlite');
mkdirSync(path.dirname(databasePath), { recursive: true });
const configuredOrigin = process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL;
let publicOrigin;
if (configuredOrigin) {
  const parsed = new URL(configuredOrigin);
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('PUBLIC_BASE_URL must be an HTTP(S) origin without a path, query, or credentials.');
  }
  publicOrigin = parsed.origin;
}
const db = new DatabaseSync(databasePath);
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, shortCode TEXT UNIQUE NOT NULL, destinationUrl TEXT NOT NULL, createdAt TEXT NOT NULL)');
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '8kb' }));
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
app.post('/api/links', (req, res) => {
  let destination;
  try { destination = normalizeUrl(req.body?.url); } catch (error) { return res.status(400).json({ error: error.message }); }
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = Array.from({ length: 7 }, () => alphabet[randomInt(alphabet.length)]).join('');
    const saved = db.prepare('INSERT OR IGNORE INTO links VALUES (?, ?, ?, ?)').run(randomUUID(), code, destination, new Date().toISOString());
    if (saved.changes) return res.status(201).json({ code, destinationUrl: destination, ...(publicOrigin ? { shortUrl: `${publicOrigin}/${code}` } : {}) });
  }
  return res.status(503).json({ error: 'Unable to create a short link. Please try again.' });
});
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
app.get('/:code', (req, res, next) => {
  if (!/^[a-zA-Z2-9]{6,8}$/.test(req.params.code)) return next();
  const record = db.prepare('SELECT destinationUrl FROM links WHERE shortCode = ?').get(req.params.code);
  if (!record) return notFound(res);
  res.set('Cache-Control', 'no-store').redirect(302, record.destinationUrl);
});
function notFound(res) {
  res.status(404).type('html').send('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Link not found — QR Link</title><body style="font-family:system-ui;background:#f5f5f7;color:#1d1d1f;padding:12vh 24px;text-align:center"><h1>Link not found.</h1><p>This short link does not exist.</p><a href="/">Create a QR code</a></body></html>');
}
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
app.use((_req, res) => notFound(res));
app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') return res.status(400).json({ error: 'Invalid request.' });
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
const server = app.listen(process.env.PORT || 3000, host, () => console.log(`QR Link listening on ${host}:${server.address().port}${publicOrigin ? ` — public URL: ${publicOrigin}` : ''}`));
process.on('SIGTERM', () => server.close(() => { db.close(); process.exit(0); }));
