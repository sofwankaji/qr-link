import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ headless: true, timeout: 15000 });
const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const base = 'http://localhost:3000';
function decode(buffer, expected, size) {
  const png = PNG.sync.read(buffer);
  if (size) { assert.equal(png.width, size); assert.equal(png.height, size); }
  assert.equal(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data, expected);
}
async function preview(expected) {
  await page.getByRole('img').waitFor();
  const src = await page.getByRole('img').getAttribute('src');
  decode(Buffer.from(src.split(',')[1], 'base64'), expected);
  assert.equal(await page.locator('.encoded-url').textContent(), expected);
}
async function generate(input, keyboard = false) {
  await page.getByLabel('Destination URL', { exact: true }).fill(input);
  if (keyboard) await page.getByLabel('Destination URL', { exact: true }).press('Enter');
  else await page.getByRole('button', { name: 'Generate QR' }).click();
}
await page.goto(base);
assert.ok(await page.getByText('Your QR code will appear here.').isVisible());
await generate('example.com', true);
await preview('https://example.com');
const destination = 'https://example.com/test?a=1#demo';
await generate(destination); await preview(destination);
await page.getByRole('button', { name: 'Copy Link' }).click();
assert.ok(await page.getByRole('button', { name: 'Copied' }).isVisible());
assert.equal(await page.evaluate(() => navigator.clipboard.readText()), destination);
await page.getByRole('button', { name: 'Copy Link' }).waitFor();
const open = page.getByRole('link', { name: 'Open', exact: true });
assert.equal(await open.getAttribute('href'), destination);
assert.equal(await open.getAttribute('rel'), 'noopener noreferrer');
assert.equal(await open.getAttribute('target'), '_blank');
const popupPromise = page.waitForEvent('popup');
await open.click(); const popup = await popupPromise; assert.ok(popup.url().startsWith('https://example.com/test')); await popup.close();
await page.getByRole('tab', { name: 'Preview' }).focus();
await page.keyboard.press('ArrowRight');
assert.equal(await page.getByRole('tab', { name: 'Download' }).getAttribute('aria-selected'), 'true');
for (const size of [512, 1024, 2048]) {
  await page.getByLabel('Image size').selectOption(String(size));
  const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download QR' }).click();
  const download = await downloadPromise; const path = `test-results/qr-${size}.png`; await download.saveAs(path); decode(await readFile(path), destination, size);
}
await page.getByRole('radio', { name: 'SVG', exact: true }).check();
const svgPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download QR' }).click(); const svgDownload = await svgPromise; await svgDownload.saveAs('test-results/qr.svg');
const svg = await readFile('test-results/qr.svg', 'utf8'); assert.ok(svg.includes('<svg')); assert.ok(svg.includes('<path')); assert.ok(!svg.includes('<image'));
const svgPage = await context.newPage(); await svgPage.goto(base);
await svgPage.evaluate(svg => { const parser = new DOMParser(); const parsed = parser.parseFromString(svg, 'image/svg+xml'); if (parsed.querySelector('parsererror')) throw new Error('Invalid SVG'); const img = document.createElement('img'); img.src = `data:image/svg+xml;base64,${btoa(svg)}`; img.width = 1024; img.height = 1024; document.body.replaceChildren(img); }, svg);
await svgPage.locator('img').evaluate(img => img.decode()); decode(await svgPage.locator('img').screenshot(), destination, 1024); await svgPage.close();
await page.getByRole('radio', { name: 'Short Link', exact: true }).check(); await generate(destination); await page.getByRole('img').waitFor();
const short = await page.locator('.encoded-url').textContent(); assert.match(short, /localhost:3000\/[a-zA-Z2-9]{7}$/); await preview(short);
const redirect = await fetch(short, { redirect: 'manual' }); assert.equal(redirect.status, 302); assert.equal(redirect.headers.get('location'), destination);
await writeFile('test-results/short.json', JSON.stringify({ short, destination }));
const missing = await fetch(`${base}/ZZZZZZZ`, { redirect: 'manual' }); assert.equal(missing.status, 404); assert.equal(missing.headers.get('location'), null);
for (const invalid of ['bad url', 'javascript:alert(1)', 'data:text/html,test']) {
  await generate(invalid); assert.ok(await page.getByRole('alert').isVisible()); assert.equal(await page.getByLabel('Destination URL', { exact: true }).inputValue(), invalid); assert.equal(await page.getByRole('img').count(), 0);
  const response = await fetch(`${base}/api/links`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: invalid }) }); assert.equal(response.status, 400);
}
await page.getByRole('radio', { name: 'Original URL', exact: true }).check(); await generate('example.com'); await preview('https://example.com');
for (const width of [1440, 1024, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const qr = await page.getByRole('img').boundingBox(); assert.ok(qr.x >= 0 && qr.x + qr.width <= width);
  if (width === 390) { const settings = await page.locator('.settings').boundingBox(); const result = await page.locator('.result').boundingBox(); assert.ok(result.y >= settings.y + settings.height); }
  await page.screenshot({ path: `test-results/success-${width}.png`, fullPage: true });
}
// Exercise server failure and a visible processing state without arbitrary delays.
await page.getByRole('radio', { name: 'Short Link', exact: true }).check();
let release; const gate = new Promise(resolve => { release = resolve; });
await page.route('**/api/links', async route => { await gate; await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Unable to create a short link. Please try again.' }) }); });
await generate(destination); await page.getByRole('button', { name: 'Generating…' }).waitFor(); assert.ok(await page.getByRole('button', { name: 'Generating…' }).isDisabled()); release(); await page.getByRole('alert').waitFor(); assert.equal(await page.getByLabel('Destination URL', { exact: true }).inputValue(), destination); await page.unroute('**/api/links');
await page.getByRole('radio', { name: 'Original URL', exact: true }).check(); await generate(destination, true); await preview(destination);
assert.deepEqual(errors, []);
await browser.close();
console.log('PASS: original/short QR decoding, redirects, validation, clipboard, Open, keyboard tabs/Enter, PNG 512/1024/2048 decoding, vector SVG decoding, loading/error recovery, responsive 1440/1024/390, browser console.');
