# QR Link — Product Specification

## Current user override — 2026-10-03

Short Link is removed entirely. References below to shortening, persistence, redirects, link modes, and backend/database requirements are retired. Current flow: Paste URL → Choose QR appearance → Generate → Preview/Copy/Open/Download. QR encodes the normalized destination directly. GitHub Pages hosts the full product without backend services.

Cat is the default appearance alongside Classic, Rounded, and Dots. Cartoon ears, whiskers, blush, and paws stay outside the full white quiet zone. Cat uses standard square modules and H error correction. Preview and PNG/SVG exports retain identical appearance and exact square PNG sizes. No decoration covers encoded modules. The user requested no tests; report build/deployment status without claiming Cat has been scan-verified.

## User-approved extensions — 2026-10-03

The user explicitly requested more playful generated QR artwork and Cloudflare hosting for online short links. This overrides the original V1 exclusion of QR colors/module shapes for these features only. Support Classic, Rounded, and Dots with curated dark Graphite, Ocean, and Forest inks, preserving white background and quiet zone. Keep preview/export appearance aligned. Use Cloudflare Workers + D1 for the GitHub Pages short-link backend.

## Product overview
QR Link is a single-page utility that converts a URL into a QR code and can optionally create a Short Link.

Primary flow:

```text
Paste URL → Choose Original URL / Short Link → Generate QR
→ Preview immediately on the same page → Copy / Open / Download
```

The product should feel immediate, calm, premium, lightweight, and production-ready.

## V1 goals
Users can:
- enter a URL;
- use the original URL directly or create a short link;
- generate without page reload or result-page navigation;
- see the QR immediately;
- see the exact encoded/generated URL;
- copy or open that URL;
- switch between Preview and Download;
- download QR artwork as PNG or SVG;
- choose 512, 1024, or 2048 PNG size;
- open a generated short URL and be redirected server-side to the exact saved destination.

## Information architecture
One primary page only:

```text
Header
Compact Intro
Main Tool
├─ URL Settings
└─ QR Result
```

No sidebar, dashboard, large marketing section, or separate result page in V1.

## UX/UI — Minimal White Glass
Use Apple-inspired design principles without copying Apple branding, proprietary assets, exact layouts, icons, or trade dress.

Desired feeling:
- minimal;
- white/off-white;
- quiet;
- precise;
- premium;
- spacious;
- fast;
- trustworthy.

Glass is a supporting material, not decoration.

### Background and colors
Preferred page background: `#F5F5F7`; nearby neutral `#F7F7F8` is acceptable.

Primary text: `#1D1D1F`  
Secondary text: `#6E6E73`  
Muted text: `#86868B`

Primary CTA: dark near-black background with white text.

Do not use strong gradients, neon, colored glow, floating blobs, or gradient text.

### Typography
Use:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Inter",
  "Segoe UI",
  system-ui,
  sans-serif;
```

Do not require proprietary Apple font files.

Suggested scale:
- Page title: 36–42px, weight 600.
- Subtitle: 15–17px, weight 400.
- Panel heading: 17–19px, weight 600.
- Body: 14–16px.
- Label: 13–14px, weight 500.
- Helper text: 12–13px.

Avoid excessive bold text.

### Spacing
Use an 8px rhythm: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

Whitespace is part of the design.

### Radius
- Small: 10px.
- Inputs/buttons: 12–14px.
- Medium surface: 16–18px.
- Major panels: 20–24px.

Avoid excessive pill-shaped controls.

### Glass surfaces
Use glass mainly on the two major panels: Settings and Result.

Suggested surface:

```css
background: rgba(255,255,255,.68);
backdrop-filter: blur(22px);
-webkit-backdrop-filter: blur(22px);
border: 1px solid rgba(255,255,255,.78);
box-shadow: 0 12px 40px rgba(0,0,0,.05);
```

A subtle neutral border such as `rgba(29,29,31,.08)` is acceptable.

Do not nest multiple translucent cards without a functional reason.

### Inputs
Recommended height: 48–52px.

Suggested:

```css
background: rgba(255,255,255,.82);
border: 1px solid rgba(29,29,31,.10);
```

Visible focus example:

```css
box-shadow: 0 0 0 3px rgba(29,29,31,.07);
```

### Primary button
- Label: `Generate QR`.
- Full width inside Settings.
- Height: 48–50px.
- Radius: 12–14px.
- Background: `#1D1D1F`.
- Text: white.
- Hover/focus should be subtle; no glow or large scale transform.

### Motion
Use restrained 150–220ms transitions.

Allowed:
- subtle hover/focus;
- tab transition;
- Copy Link → Copied;
- small result fade/translate by only a few pixels.

Avoid bounce, spring-heavy motion, parallax, animated gradients, QR spinning, or constant background motion.

Respect `prefers-reduced-motion`.

## Layout
Desktop:
- centered container;
- max-width around 1120px, acceptable 1080–1180px;
- 42% Settings / 58% Result;
- 20–24px gap;
- tool visible above fold on a normal desktop viewport.

Tablet:
- keep two columns only if comfortable;
- otherwise stack.

Mobile:
```text
Header
Intro
Settings
Result
```

No horizontal scrolling. QR must fit viewport. Practical touch targets should be about 44px or larger.

## ASCII wireframes

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ QR Link                                                      │
│ Create a QR code from any link.                              │
│ Paste a URL, generate a QR code, and shorten it if you want. │
│                                                              │
│ ┌────────────────────────┐  ┌───────────────────────────────┐ │
│ │ Create QR              │  │ Preview        Download      │ │
│ │ Destination URL        │  │                               │ │
│ │ [https://example.com ] │  │           ███████            │ │
│ │ [Original][Short Link] │  │           ██ QR ██            │ │
│ │ [     Generate QR    ] │  │           ███████            │ │
│ └────────────────────────┘  │ qrlink.app/kD7xP2             │ │
│                             │ [Copy Link]      [Open]       │ │
│                             └───────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

Mobile:

```text
┌────────────────────────────┐
│ QR Link                    │
│ Create a QR code from      │
│ any link.                  │
│ ┌────────────────────────┐ │
│ │ URL Settings           │ │
│ │ URL / Mode / Generate  │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ Preview | Download     │ │
│ │       QR CODE          │ │
│ │ generated URL          │ │
│ │ Copy       Open        │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

## Header and intro
Header is compact with simple `QR Link` wordmark or a small monochrome QR-like icon plus wordmark.

Do not add unnecessary V1 navigation.

Title: `Create a QR code from any link.`

Subtitle: `Paste a URL, generate a QR code, and shorten it if you want.`

Do not create a fullscreen hero.

## URL settings panel
Panel heading: `Create QR`.

Contents:
1. Destination URL label.
2. URL input.
3. Inline helper/error area.
4. Original URL / Short Link segmented control.
5. Generate QR button.

### URL normalization
Accept:
- `https://example.com`
- `http://example.com`
- `example.com`

Normalize missing protocol:
`example.com` → `https://example.com`.

Trim surrounding whitespace.

Preserve path, query, and hash. For example:

`https://example.com/test?a=1#demo`

must remain intact.

### URL validation
V1 supports only HTTP and HTTPS.

Reject:
- empty values;
- malformed URLs;
- unsupported protocols;
- dangerous schemes such as `javascript:` and `data:`.

Show errors inline. Never use `alert()`. Preserve user input after validation failure.

## Link mode
Segmented control:

```text
Original URL | Short Link
```

Default: `Original URL`.

Selected state may use a stronger white surface, very subtle shadow, and stronger text.

## Generate behavior
Pressing Enter while URL input is focused should generate if valid.

During processing:
- button label may become `Generating…`;
- disable duplicate submissions;
- preserve input;
- do not reload;
- do not navigate away.

## QR result states
Support:
- Empty;
- Loading;
- Success;
- Error.

Empty state:
`Your QR code will appear here.`

Optional secondary:
`Paste a link and generate your first QR code.`

Loading: small spinner or quiet skeleton. Do not block the full page.

Success:
- QR is the visual focal point;
- desktop display around 280–320px;
- tablet around 250–290px;
- mobile around 220–270px;
- QR must sit on a solid white background;
- preserve sufficient quiet zone;
- keep it sharp.

Error: clear inline status, not a modal.

## Preview tab
Default tab: `Preview`.

Show:
1. QR code.
2. Exact URL encoded in QR.
3. `Copy Link`.
4. `Open`.

If URL is visually truncated, Copy must still copy the full value.

Copy behavior:
`Copy Link → Copied → Copy Link`.

Open in a new tab using safe new-tab attributes.

## Download tab
Tabs: `Preview | Download`.

Format:
- PNG
- SVG

Default: PNG.

PNG sizes:
- 512×512
- 1024×1024
- 2048×2048

Default: 1024×1024.

Primary action: `Download QR`.

Export QR artwork only, never a screenshot of the UI.

PNG must match selected pixel dimensions. SVG must remain valid vector output. Both must scan correctly.

## Original URL mode
Flow:

```text
Input → Normalize → Validate → Encode normalized destination
→ Generate QR → Show result
```

No short-link persistence required.

## Short Link mode
Flow:

```text
Input → Normalize → Validate → Generate unique code
→ Persist destination → Build short URL
→ Generate QR using short URL → Show result
```

Short code requirements:
- 6–8 characters;
- random;
- non-sequential;
- collision checked;
- unique;
- avoid ambiguous `0/O` and `1/l/I` where practical.

Persist at minimum:
- id;
- shortCode;
- destinationUrl;
- createdAt.

Do not rely only on frontend memory.

Opening `/<shortCode>` must resolve the record and perform a server-side redirect to the exact stored destination.

Unknown short codes must return a clean Not Found experience, never an arbitrary redirect.

## Security basics
Treat URL input as untrusted.

Requirements:
- HTTP/HTTPS only;
- reject dangerous schemes;
- escape displayed values;
- never inject raw URL input as HTML;
- keep server secrets out of frontend code;
- validate before persistence;
- use safe new-tab attributes;
- keep redirect behavior limited to explicitly validated destinations stored by the application.

## Accessibility
Required:
- semantic HTML;
- associated URL label;
- actual button elements;
- keyboard-accessible segmented control;
- keyboard-accessible tabs;
- visible focus states;
- logical tab order;
- Enter-to-generate;
- accessible errors;
- accessible names for icon-only controls;
- sufficient contrast;
- ~44px practical touch targets;
- reduced-motion support.

## Visual guardrails
Do:
- use glass mainly on two major panels;
- keep text high contrast;
- use neutral monochrome colors;
- keep QR on solid white;
- keep hierarchy clear;
- keep primary action obvious.

Do not:
- use purple/blue gradients;
- use neon;
- use glow;
- use floating blobs;
- use gradient text;
- build a giant hero;
- make every control glass;
- stack many glass cards;
- overuse pills;
- add decorative animation;
- imitate a generic AI landing page.

## V1 scope
Include:
- URL input, normalization, validation;
- Original URL mode;
- Short Link mode;
- random short-code generation;
- persistence;
- server-side redirect;
- QR preview on same page;
- Empty/Loading/Success/Error;
- Preview and Download tabs;
- Copy Link and Open;
- PNG and SVG export;
- PNG size selector;
- responsive layout;
- accessibility basics;
- Minimal White Glass styling.

## Explicitly out of scope
Do not implement yet:
- authentication;
- accounts;
- payment/subscription;
- analytics or scan history;
- QR history/dashboard;
- custom aliases;
- custom domains;
- QR colors/logos/module shapes;
- password protection;
- expiration;
- bulk generation;
- teams;
- public API.

## Definition of Done
V1 is complete only when verified:

1. `example.com` normalizes to `https://example.com`.
2. `https://example.com/test?a=1#demo` preserves path/query/hash.
3. Original QR points directly to normalized destination.
4. Short QR points to generated short URL.
5. Generated short URL redirects to exact saved destination.
6. Malformed input fails inline, preserves input, and produces no QR.
7. Dangerous schemes are rejected.
8. Copy Link copies complete URL.
9. Open opens the correct URL safely.
10. PNG 512, 1024, and 2048 use exact dimensions and scan.
11. SVG is valid vector output and scans.
12. Unknown short code is handled cleanly.
13. 1440px, 1024px, and 390px have no horizontal overflow.
14. Keyboard flow and Enter generation work.
15. Tabs are keyboard accessible.
16. Relevant browser console errors are absent.
17. Relevant server runtime errors are absent.
18. Lint/tests pass where configured.
19. Production build succeeds.
