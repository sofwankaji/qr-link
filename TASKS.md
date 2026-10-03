# Single Phase — Build & Verify QR Link

Scope updated at the user's request: remove Short Link, retain QR style/color controls, and add a cute cartoon cat design. Tests are skipped by explicit user instruction. Do not mark implementation-only work as verified.

## Current implementation
- [ ] Verify Short Link controls, API, redirects, and deployment configuration are removed.
- [ ] Verify Cat, Classic, Rounded, and Dots preview appearance.
- [ ] Verify Cat decoration stays outside the QR matrix and quiet zone.
- [ ] Verify downloaded PNG/SVG match the chosen design.
- [ ] Verify exact 512/1024/2048 PNG dimensions and scanning.
- [ ] Verify SVG vector validity and scanning.
- [ ] Verify URL normalization, validation, and input preservation.
- [ ] Verify Copy, Open, keyboard controls, and Enter generation.
- [ ] Verify 1440/1024/390 responsive layout.
- [ ] Review browser/server console output.
- [ ] Complete production build for the latest implementation.
- [ ] Confirm GitHub Pages deployment completed.

## External resources
- Cloudflare D1 `qr-link-db` is retained and unused after Short Link was cancelled. Worker publishing was unsuccessful; no Cloudflare Worker was deployed by this task.
