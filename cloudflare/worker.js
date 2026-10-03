import { normalizeUrl } from '../src/url.js';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function randomCode() {
  let code = '';
  while (code.length < 7) {
    for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
      if (byte < 256 - (256 % alphabet.length)) code += alphabet[byte % alphabet.length];
      if (code.length === 7) break;
    }
  }
  return code;
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowed = new Set((env.ALLOWED_ORIGINS || 'https://sofwankaji.github.io').split(',').map(value => value.trim()));
    const headers = new Headers({ 'Cache-Control': 'no-store', Vary: 'Origin' });
    if (origin && allowed.has(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    const json = (data, status = 200) => Response.json(data, { status, headers });
    if (url.pathname.startsWith('/api/') && origin && !allowed.has(origin)) return json({ error: 'This origin is not allowed.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (url.pathname === '/healthz' && request.method === 'GET') return json({ status: 'ok' });
    try {
      if (url.pathname === '/api/links' && request.method === 'POST') {
        if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ error: 'JSON input is required.' }, 415);
        const text = await request.text();
        if (text.length > 8192) return json({ error: 'Request is too large.' }, 413);
        let destination;
        try { destination = normalizeUrl(JSON.parse(text).url); } catch (error) { return json({ error: error instanceof SyntaxError ? 'Invalid request.' : error.message }, 400); }
        const base = env.PUBLIC_BASE_URL ? new URL(env.PUBLIC_BASE_URL).origin : url.origin;
        for (let attempt = 0; attempt < 10; attempt++) {
          const code = randomCode();
          const saved = await env.DB.prepare('INSERT OR IGNORE INTO links (id, shortCode, destinationUrl, createdAt) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), code, destination, new Date().toISOString()).run();
          if (saved.meta.changes) return json({ code, destinationUrl: destination, shortUrl: `${base}/${code}` }, 201);
        }
        return json({ error: 'Unable to create a short link. Please try again.' }, 503);
      }
      if (request.method === 'GET' && /^\/[a-zA-Z2-9]{6,8}$/.test(url.pathname)) {
        const record = await env.DB.prepare('SELECT destinationUrl FROM links WHERE shortCode = ?').bind(url.pathname.slice(1)).first();
        if (record) {
          const destination = normalizeUrl(record.destinationUrl);
          return new Response(null, { status: 302, headers: { Location: destination, 'Cache-Control': 'no-store' } });
        }
      }
      if (url.pathname.startsWith('/api/')) return json({ error: 'Not found.' }, 404);
      return new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Link not found — QR Link</title><body style="font-family:system-ui;background:#f5f5f7;color:#1d1d1f;padding:12vh 24px;text-align:center"><h1>Link not found.</h1><p>This short link does not exist.</p><a href="https://sofwankaji.github.io/qr-link/">Create a QR code</a></body></html>', { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    } catch (error) {
      console.error('Short-link request failed', error);
      return json({ error: 'The short-link service is unavailable. Please try again.' }, 503);
    }
  },
};
