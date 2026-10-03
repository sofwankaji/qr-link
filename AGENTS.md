# Codex Project Instructions

Read this file completely before editing.

Then read:
1. `SPEC.md`
2. `TASKS.md`

`SPEC.md` is the source of truth for behavior, scope, and UX/UI.

`TASKS.md` intentionally contains one implementation phase only.

## Core rule
Writing code is not completion. Verification is completion.

Never claim a feature works simply because code was written or appears correct.

## Before editing
1. Inspect repository structure.
2. Identify frontend framework.
3. Identify backend/runtime.
4. Identify routing.
5. Identify persistence/storage.
6. Review dependencies.
7. Inspect relevant existing code.
8. Run the current app when possible.
9. Check browser console.
10. Check server console.
11. Identify working behavior and current bugs.

Do not immediately rewrite the project. Preserve working functionality unless it conflicts with `SPEC.md`.

## Source of truth and scope
Follow `SPEC.md`.

Do not silently change product behavior or add major V1 features.

Prefer simple, maintainable, framework-native solutions.

## Implementation philosophy
Prefer:
- clear architecture;
- clear naming;
- small useful components;
- minimal dependencies;
- local state where practical;
- explicit behavior;
- root-cause fixes.

Avoid:
- overengineering;
- premature abstraction;
- unnecessary global state;
- dependency bloat;
- rewriting working code without reason;
- hacks that hide the underlying bug.

## Minimal White Glass rules
The approved direction is Apple-inspired Minimal White Glass, not an Apple clone.

Use:
- off-white neutral canvas;
- near-black typography;
- strong hierarchy;
- large whitespace;
- glass only on major surfaces;
- 18–24px moderate blur;
- thin subtle borders;
- very soft shadows;
- 20–24px major panel radius;
- 12–14px control radius;
- one dark primary CTA;
- compact header and intro;
- QR as visual focal point;
- restrained 150–220ms motion.

Never add without explicit request:
- purple/blue gradients;
- neon/glow;
- floating blobs;
- gradient text;
- giant hero;
- excessive pills;
- nested glass cards;
- decorative motion;
- generic AI landing-page styling.

Do not compromise QR scan reliability for aesthetics. QR must use a solid high-contrast background and sufficient quiet zone.

## Primary interaction
The user must complete:

```text
Paste URL → Choose mode → Generate → See QR
```

on one page.

Do not navigate to a separate result page. Do not force reload.

## URL handling
Always:
1. trim whitespace;
2. normalize missing protocol to HTTPS;
3. validate;
4. allow only HTTP/HTTPS;
5. reject dangerous schemes;
6. preserve path/query/hash;
7. preserve input after errors.

Regression-test:
- `example.com`
- `https://example.com`
- `https://example.com/test`
- `https://example.com/test?a=1`
- `https://example.com/test?a=1#demo`

Do not create short links for invalid destinations.

## Short link rules
Short links must:
- use random non-sequential 6–8 character codes;
- collision-check;
- persist destinations;
- redirect server-side;
- resolve exact stored destinations;
- handle unknown codes safely;
- never depend only on volatile frontend memory.

Keep secrets out of frontend code.

## QR correctness
Original mode QR must contain the normalized destination.

Short mode QR must contain the generated short URL, and opening that short URL must redirect to the exact stored destination.

The displayed URL, QR encoded value, and downloaded QR must agree.

Do not assume a QR is correct just because it renders. Verify the encoded value and/or scan it when practical.

## Preview actions
Verify:
- Copy Link copies full value even when visually truncated;
- Copy state changes to `Copied` and returns cleanly;
- Open uses correct generated URL;
- Open uses safe new-tab behavior;
- result stays on the same page.

## Download rules
Verify:
- PNG exports QR artwork only;
- 512×512 is exact;
- 1024×1024 is exact;
- 2048×2048 is exact;
- SVG is valid vector;
- PNG scans;
- SVG scans.

Never export a screenshot of the UI result card.

## UI states and errors
Implement and verify:
- Empty;
- Loading;
- Success;
- Error.

Do not use `alert()` for normal errors.

Use inline or small non-blocking feedback. Preserve input after failure.

## Accessibility
Use:
- semantic HTML;
- proper labels;
- real buttons;
- keyboard-accessible tabs;
- keyboard-accessible segmented control;
- visible focus states;
- logical tab order;
- Enter-to-generate;
- accessible errors;
- practical ~44px touch targets;
- sufficient contrast;
- reduced-motion support.

## Responsive verification
Always test at:
- 1440px;
- 1024px;
- 390px.

Check:
- no horizontal overflow;
- no clipped QR;
- no overlapping controls;
- QR remains readable;
- mobile stacks Settings then Result;
- controls remain comfortable.

## Bug fixing workflow
When fixing a bug:
1. reproduce it;
2. find root cause;
3. inspect related behavior;
4. fix root cause;
5. retest original scenario;
6. regression-test nearby flows;
7. check browser console;
8. check server console.

Do not use forced refreshes, arbitrary delays, or hiding UI as substitutes for a real fix.

## Browser verification
When browser tooling is available, test the actual application.

Verify:
- rendering;
- URL form;
- segmented control;
- Enter;
- Generate;
- all result states;
- QR correctness;
- tabs;
- Copy;
- Open;
- PNG;
- SVG;
- short-link redirect;
- responsive behavior;
- console output.

Do not rely only on source inspection.

## Dependency rule
Before installing a package:
1. inspect current dependencies;
2. check browser/runtime APIs;
3. confirm real benefit;
4. prefer maintained packages;
5. avoid duplicates.

Do not install dependencies solely for trivial styling.

## Task tracking
`TASKS.md` must remain a single phase.

Do not split it into Phase 0/1/2/etc.

Subsections inside the one phase are allowed.

Only check a task after it is implemented and verified.

## Production checks
Before declaring V1 complete, run where configured:
- lint;
- tests;
- production build.

Review browser and server console output.

Do not claim completion with a broken production build.

## Required end-to-end checks
At minimum:
1. `example.com` → `https://example.com`.
2. `https://example.com/test?a=1#demo` remains intact.
3. Original QR points directly to destination.
4. Short QR points to generated short URL.
5. Short URL redirects to exact saved destination.
6. Malformed URL fails inline and preserves input.
7. PNG 1024 is actually 1024×1024 and scans.
8. SVG is valid vector and scans.
9. 1440/1024/390 have no horizontal overflow.
10. Keyboard flow and Enter generation work.
11. Relevant browser/server console errors are absent.
12. Production build succeeds.

## Completion report
When finished, report:
1. what changed;
2. what was tested;
3. test results;
4. known limitations.

Never present untested behavior as confirmed.

## Final rule
Do not stop immediately after editing code.

The final development action must be verification of the complete affected user flow.
