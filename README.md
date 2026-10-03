# QR Link

Single-page QR utility built with React, Vite, Express, and persistent SQLite. Requires Node.js 24 or newer.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. The same server handles the frontend, short-link creation, and redirects.

## Production

```sh
npm run build
npm start
```

Set `PORT` to change the port and `DB_PATH` to change the SQLite location. The default is `data/links.sqlite`; preserve and back up this file. Production binds to `0.0.0.0`; development binds to loopback. Set `HOST` to override this.

## GitHub and online short links

GitHub stores the source; GitHub Pages cannot run this Express server or persistent SQLite redirects. Deploy the entire application to a Node.js host with persistent disk, using the same origin for the page and redirect routes.

Set `PUBLIC_BASE_URL` to your deployed HTTPS origin (e.g. `https://qr-link.example.com`). The API returns short URLs using this origin, so the frontend and QR use the online address. On Render, `RENDER_EXTERNAL_URL` supplies the service's public origin automatically. Existing localhost QR codes are not rewritten; generate new QR codes after deployment.

The optional `render.yaml` creates a Node 24 service with a persistent disk at `/var/data` and a `/healthz` health endpoint. This requires a paid Render plan: review costs before creating the service. Connect the GitHub repository in Render and deploy its Blueprint; set `PUBLIC_BASE_URL` only if using your own domain. Never use an ephemeral disk for persistent short links.

For another host, use the included Dockerfile, mount persistent storage at `/app/data`, configure `PUBLIC_BASE_URL`, and place the service behind HTTPS. Source changes on GitHub run a production build through the included workflow; hosting deployment is configured separately.

Source repository: https://github.com/sofwankaji/qr-link (public).

The GitHub Pages workflow publishes the frontend at https://sofwankaji.github.io/qr-link/. Original URL QR generation runs entirely in the browser. Short Link is explicitly unavailable on Pages until an online backend is connected; Pages cannot run Express or SQLite. The full server application still supports Short Link.

To connect an online backend, set the repository Actions variable `QR_API_ORIGIN` to its HTTPS origin, configure the backend's `PUBLIC_BASE_URL`, allow this Pages origin through its CORS settings, and rerun the Pages deployment. Deploy the backend separately with persistent storage; no localhost fallback is used by the Pages Short Link interface.

## Verification

## Cloudflare Short Link backend

The backend in `cloudflare/worker.js` uses Cloudflare Workers + D1. It returns public short URLs and redirects exact saved destinations. CORS allows the GitHub Pages origin only.

1. Authenticate with `npx wrangler login --scopes account:read user:read workers:write d1:write`.
2. Create a database with `npx wrangler d1 create qr-link-db`, then set its returned database ID in `wrangler.jsonc`.
3. Initialize storage with `npx wrangler d1 execute qr-link-db --remote --file cloudflare/schema.sql`.
4. Publish with `npx wrangler deploy`.
5. Set the GitHub repository Actions variable `QR_API_ORIGIN` to the published Worker's HTTPS origin and rerun the Pages deployment.

Wrangler authentication remains local and must never be committed. Custom domains are optional; the Worker's `workers.dev` address works for public short links. No Cloudflare deployment has been completed until authentication and the steps above succeed.

## QR appearance

Choose Classic, Rounded, or Dots and Graphite, Ocean, or Forest dark ink. Appearance updates the current result without creating another short link. Preview and download use the same design; exports retain a white background and four-module quiet zone. Rounded and Dots keep QR reserved patterns square and use H error correction. These new styles have not been scan-tested because testing was explicitly skipped at the user's request.

## Verification commands

```sh
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:server
npm run test:e2e
```

Run the server before server and E2E testing. Unit tests decode the shared QR export function's PNG and SVG output. The E2E suite downloads and decodes QR artwork, checks real browser interactions, redirects, and three viewport widths. Artifacts go to `test-results/`. No lint configuration is currently provided; `check` validates server syntax. See VERIFICATION.md for actual results and checks still pending in this environment.

V1 intentionally excludes accounts, analytics, customization, and history. SQLite emits an experimental API warning on this Node version; this is a runtime warning, not an application failure.
