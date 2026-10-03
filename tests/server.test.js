import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
const base = process.env.TEST_ORIGIN || 'http://localhost:3000';
test('Short links persist, use unique random codes, and redirect to exact destinations', async () => {
  const codes = new Set();
  for (let i = 0; i < 12; i++) {
    const destination = `https://example.com/test?a=${i}#demo`;
    const response = await fetch(`${base}/api/links`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: destination }) });
    assert.equal(response.status, 201);
    const { code } = await response.json(); assert.match(code, /^[a-zA-Z2-9]{7}$/); assert.ok(!codes.has(code)); codes.add(code);
    const redirect = await fetch(`${base}/${code}`, { redirect: 'manual' }); assert.equal(redirect.status, 302); assert.equal(redirect.headers.get('location'), destination);
    const db = new DatabaseSync('data/links.sqlite', { readOnly: true });
    const saved = db.prepare('SELECT * FROM links WHERE shortCode = ?').get(code); assert.equal(saved.destinationUrl, destination); assert.ok(saved.id); assert.ok(saved.createdAt); db.close();
  }
});
test('Invalid destinations never persist', async () => {
  const db = new DatabaseSync('data/links.sqlite', { readOnly: true });
  const count = () => db.prepare('SELECT COUNT(*) AS total FROM links').get().total;
  const before = count();
  for (const url of ['', 'bad url', 'javascript:alert(1)', 'data:text/html,test']) {
    const response = await fetch(`${base}/api/links`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) }); assert.equal(response.status, 400);
  }
  assert.equal(count(), before); db.close();
});
test('Unknown short codes return 404 without redirect', async () => {
  const response = await fetch(`${base}/ZZZZZZZ`, { redirect: 'manual' }); assert.equal(response.status, 404); assert.equal(response.headers.get('location'), null);
});
