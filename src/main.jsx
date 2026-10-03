import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { qrArtwork } from './qr.js';
import { normalizeUrl } from './url.js';
import './style.css';
import './glass.css';

function Choices({ label, values, value, onChange, disabled }) {
  return <fieldset className="choices" style={{ '--selection': values.findIndex(([key]) => key === value), '--count': values.length }} disabled={disabled}><legend className="sr-only">{label}</legend>{values.map(([key, title]) => <label key={key} className={value === key ? 'selected' : ''}><input type="radio" name={label} value={key} checked={value === key} onChange={() => onChange(key)}/><span>{title}</span></label>)}</fieldset>;
}
function App() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('original');
  const [status, setStatus] = useState('empty');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('preview');
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState('1024');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [downloading, setDownloading] = useState(false);
  const busy = useRef(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function generate(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setError(''); setFeedback(''); setCopied(false); clearTimeout(timer.current); setResult(null);
    try {
      const destination = normalizeUrl(input);
      setStatus('loading');
      let url = destination;
      if (mode === 'short') {
        const response = await fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: destination }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to create your short link. Please try again.');
        url = data.shortUrl || `${window.location.origin}/${data.code}`;
      }
      const image = await qrArtwork(url);
      setResult({ url, image, mode }); setStatus('success'); setTab('preview');
    } catch (failure) { setError(failure.message || 'Unable to generate QR. Please try again.'); setStatus('error'); }
    finally { busy.current = false; }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(result.url); setCopied(true); setFeedback(''); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1800); }
    catch { setFeedback('Could not access the clipboard. Select and copy the URL above.'); }
  }
  async function download() {
    setDownloading(true); setFeedback('');
    try {
      const data = await qrArtwork(result.url, format, size);
      const url = format === 'svg' ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}` : data;
      const link = document.createElement('a'); link.href = url; link.download = `qr-link-${result.mode}${format === 'png' ? `-${size}` : ''}.${format}`; document.body.append(link); link.click(); link.remove();
    } catch { setFeedback('Unable to download the QR. Please try again.'); }
    finally { setDownloading(false); }
  }
  function tabKey(event) {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); const next = event.key === 'Home' ? 'preview' : event.key === 'End' ? 'download' : tab === 'preview' ? 'download' : 'preview'; setTab(next); document.getElementById(`tab-${next}`).focus();
    }
  }
  return <main className="shell">
    <header><a className="wordmark" href="/" aria-label="QR Link home"><span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h-3zM18 18h3v3h-3zM12 3v3M3 12h3M12 12h3M21 12v3M12 18v3"/></svg></span>QR Link</a><span className="header-note">A little link. A lot of possibility.</span></header>
    <section className="intro"><p className="eyebrow">LINKS, MADE SCANNABLE</p><h1>Create a QR code<br className="mobile-break"/> from any link.</h1><p>Paste a URL, generate a QR code, and shorten it if you want.</p></section>
    <div className="tool">
      <section className="panel settings" aria-labelledby="settings-title"><div className="panel-top"><span className="step">01</span><h2 id="settings-title">Create QR</h2></div><p className="panel-description">Your next connection starts with a link.</p>
        <form onSubmit={generate} noValidate><label className="input-label" htmlFor="destination">Destination URL</label><input id="destination" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck="false" placeholder="https://example.com" value={input} onChange={event => setInput(event.target.value)} aria-describedby="url-help" aria-invalid={status === 'error'} disabled={status === 'loading'}/>
          <p id="url-help" className={error ? 'helper error' : 'helper'} role={error ? 'alert' : undefined}>{error || 'No https://? We’ll add it for you.'}</p>
          <label className="input-label mode-label">Link mode</label><Choices label="Link mode" values={[[ 'original', 'Original URL' ], [ 'short', 'Short Link' ]]} value={mode} onChange={setMode} disabled={status === 'loading'}/>
          <p key={mode} className="mode-help">{mode === 'original' ? 'Your QR opens the destination directly.' : 'A compact link that redirects to your destination.'}</p>
          <button className="primary generate" disabled={status === 'loading'}>{status === 'loading' ? 'Generating…' : 'Generate QR'}<span aria-hidden="true">↗</span></button>
        </form><div className="settings-foot"><span aria-hidden="true">✓</span> Clean, high-contrast QR. Ready to scan.</div>
      </section>
      <section className="panel result" data-state={status} aria-label="QR result" aria-busy={status === 'loading'}><div className="result-header"><div role="tablist" aria-label="Result view" style={{ '--selection': tab === 'preview' ? 0 : 1 }}>{['preview', 'download'].map(key => <button key={key} role="tab" id={`tab-${key}`} aria-controls="result-content" aria-selected={tab === key} tabIndex={tab === key ? 0 : -1} onKeyDown={tabKey} onClick={() => { setTab(key); setFeedback(''); }} className={tab === key ? 'active' : ''}>{key === 'preview' ? 'Preview' : 'Download'}</button>)}</div><span className="result-label">{result ? <><span className="ready-dot" aria-hidden="true"/>READY TO SCAN</> : 'YOUR QR CODE'}</span></div>
        <div id="result-content" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
          {status !== 'success' ? <div className="empty"><div className={`empty-symbol ${status === 'loading' ? 'loading' : ''}`} aria-hidden="true">{status === 'loading' ? '◌' : '▦'}</div><h3>{status === 'loading' ? 'Creating your QR code…' : status === 'error' ? 'Let’s try that link again.' : 'Your QR code will appear here.'}</h3><p>{status === 'error' ? 'Check the URL and generate again.' : status === 'loading' ? 'Just a moment. Your link is on its way.' : 'Paste a link and generate your first QR code.'}</p></div> : <div className="success"><div className="qr-wrap"><img src={result.image} alt={`QR code for ${result.url}`} width="300" height="300"/></div>
            {tab === 'preview' ? <div key="preview" className="preview-details"><p className="encoded-label">{result.mode === 'short' ? 'YOUR SHORT LINK' : 'DESTINATION URL'}</p><p className="encoded-url" title={result.url}>{result.url}</p><div className="preview-actions"><button className={`secondary ${copied ? 'is-copied' : ''}`} onClick={copy}><span key={String(copied)} className="action-text">{copied ? 'Copied' : 'Copy Link'}</span><span className="action-icon" aria-hidden="true">{copied ? '✓' : '⧉'}</span></button><a className="secondary" href={result.url} target="_blank" rel="noopener noreferrer">Open<span className="action-icon" aria-hidden="true">↗</span></a></div></div> : <div key="download" className="download-controls"><div className="download-row"><div><p className="input-label">Format</p><Choices label="Download format" values={[[ 'png', 'PNG' ], [ 'svg', 'SVG' ]]} value={format} onChange={setFormat}/></div>{format === 'png' ? <div><label className="input-label" htmlFor="size">Image size</label><select id="size" value={size} onChange={event => setSize(event.target.value)}>{['512', '1024', '2048'].map(s => <option key={s} value={s}>{s} × {s}</option>)}</select></div> : <p className="vector-note">Vector artwork.<br/>Sharp at every size.</p>}</div><button className="primary" onClick={download} disabled={downloading}>{downloading ? 'Downloading…' : 'Download QR'}<span aria-hidden="true">↓</span></button></div>}
          </div>}
        </div><p className="feedback" role="status" aria-live="polite">{feedback || (copied ? 'Link copied to clipboard.' : '')}</p>
      </section>
    </div><footer>Simple to create. Easy to share.<span>PNG & SVG · No sign-up needed</span></footer>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
