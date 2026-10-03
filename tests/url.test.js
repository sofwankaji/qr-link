import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl } from '../src/url.js';
for (const [input, output] of [['example.com', 'https://example.com'], ['  example.com  ', 'https://example.com'], ['https://example.com', 'https://example.com'], ['http://example.com', 'http://example.com'], ['https://example.com/test', 'https://example.com/test'], ['https://example.com/test?a=1', 'https://example.com/test?a=1'], ['https://example.com/test?a=1#demo', 'https://example.com/test?a=1#demo'], ['localhost:3000/test', 'https://localhost:3000/test']]) {
  test(`Normalize ${input}`, () => assert.equal(normalizeUrl(input), output));
}
for (const input of ['', 'hello', 'https://', 'javascript:alert(1)', 'data:text/html,hi', 'ftp://example.com', 'example .com', 'https://example..com', 'https://user:pass@example.com', 'https://example.com\\evil']) {
  test(`Reject ${input}`, () => assert.throws(() => normalizeUrl(input)));
}
