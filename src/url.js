export function normalizeUrl(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('Enter a destination URL to continue.');
  const value = input.trim();
  if (value.length > 2000) throw new Error('Use a URL with 2,000 characters or fewer.');
  if (/\s|[\\<>]/.test(value)) throw new Error('Enter a valid URL without spaces or backslashes.');
  const explicit = /^[a-z][a-z\d+.-]*:/i.test(value) && !/^[^/:]+:\d+(?:\/|$)/.test(value);
  if (explicit && !/^https?:\/\//i.test(value)) throw new Error('Only HTTP and HTTPS links are supported.');
  const normalized = explicit ? value : `https://${value}`;
  let url;
  try { url = new URL(normalized); } catch { throw new Error('Enter a valid destination URL, such as example.com.'); }
  const validHost = url.hostname === 'localhost' || /^\[[a-f\d:]+\]$/i.test(url.hostname) || (url.hostname.includes('.') && url.hostname.split('.').every(label => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label)));
  if (!['http:', 'https:'].includes(url.protocol) || !validHost || url.username || url.password) throw new Error('Enter a valid HTTP or HTTPS destination URL.');
  return normalized;
}
