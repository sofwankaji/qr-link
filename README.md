# QR Link

A URL-to-QR tool with white glass UI and a cute cat frame. Live at https://sofwankaji.github.io/qr-link/.

Paste a URL, choose Cat, Classic, Rounded, or Dots, select Graphite, Ocean, or Forest ink, and generate. Copy or open the destination, then download matching PNG (512, 1024, 2048) or SVG artwork.

Cat is the default design. Its ears, cheeks, whiskers, and paws surround a standard square-module QR with a white four-module quiet zone. Decorations are included in exported artwork and stay outside that zone. No logos or overlays cover encoded modules.

Short Link was removed at the user's request. QR generation runs in the browser; no database, Cloudflare Worker, or backend API is required. The previously created Cloudflare D1 database was left intact; its Worker was never deployed.

## Development

Requires Node 24+.

```sh
npm ci
npm run dev
```

## Publish

Push to `main` to build and deploy through `.github/workflows/pages.yml`. GitHub Pages uses `/qr-link/` as the Vite base path. `npm run build` builds a root-hosted version; `npm start` optionally serves it with Express.

## Verification status

Tests were not run for the new cat artwork, as requested by the user. The design preserves the QR matrix and white quiet zone, but scanning and PNG export behavior for Cat are not confirmed. Build/deployment status is reported separately.
