import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { qrArtwork } from '../src/qr.js';

const urls = ['https://example.com', 'https://example.com/test?a=1#demo', 'http://localhost:3000/Z2dfVLo'];
function decode(bytes, expected, size) {
  const png = PNG.sync.read(bytes);
  assert.equal(png.width, size); assert.equal(png.height, size);
  assert.equal(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data, expected);
}
await mkdir('test-results', { recursive: true });
for (const url of urls) {
  for (const size of [512, 1024, 2048]) test(`PNG ${size} decodes ${url}`, async () => {
    const artwork = await qrArtwork(url, 'png', size);
    const bytes = Buffer.from(artwork.split(',')[1], 'base64');
    decode(bytes, url, size);
    if (url === urls[1]) await writeFile(`test-results/artwork-${size}.png`, bytes);
  });
  test(`SVG is vector and decodes ${url}`, async () => {
    const artwork = await qrArtwork(url, 'svg');
    assert.match(artwork, /<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.match(artwork, /<path/); assert.ok(!artwork.includes('<image'));
    const bytes = await sharp(Buffer.from(artwork)).resize(1024, 1024, { kernel: 'nearest' }).ensureAlpha().png().toBuffer();
    decode(bytes, url, 1024);
    if (url === urls[1]) await writeFile('test-results/artwork.svg', artwork);
  });
}
