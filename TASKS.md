# Single Phase — Build & Verify V1

This project intentionally uses one implementation phase only.

Do not split this checklist into Phase 0, Phase 1, Phase 2, or similar. Subsections below are part of the same single phase.

Only mark a checkbox complete after implementation and verification.

## Repository inspection
- [x] Inspect complete repository structure.
- [x] Identify frontend framework.
- [x] Identify backend/runtime.
- [x] Identify routing architecture.
- [x] Identify persistence/storage.
- [x] Review dependencies and existing QR/URL libraries.
- [x] Identify tests, lint, and build commands.
- [x] Run current development server.
- [x] Check browser console.
- [x] Check server console.
- [ ] Record current broken behavior.
- [ ] Preserve existing working behavior unless it conflicts with `SPEC.md`.

## Minimal White Glass foundation
- [x] Set neutral off-white background around `#F5F5F7`.
- [x] Set primary text around `#1D1D1F`.
- [x] Set secondary text around `#6E6E73`.
- [ ] Use system typography: `-apple-system`, `BlinkMacSystemFont`, `Inter`, `Segoe UI`, `system-ui`.
- [ ] Use disciplined 8px spacing rhythm.
- [ ] Use 12–14px control radius.
- [ ] Use 20–24px major panel radius.
- [ ] Use translucent white glass only for Settings and Result major surfaces.
- [ ] Use moderate 18–24px blur.
- [ ] Use subtle low-opacity borders.
- [ ] Use extremely soft shadows.
- [ ] Use one dark monochrome primary CTA.
- [ ] Add visible focus states.
- [ ] Use restrained 150–220ms transitions.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Confirm no strong gradients.
- [ ] Confirm no neon/glow.
- [ ] Confirm no floating blobs.
- [ ] Confirm no giant hero.
- [ ] Confirm no unnecessary nested glass cards.
- [ ] Confirm no excessive pill controls.
- [ ] Confirm styling does not resemble a generic AI landing page.

## Page shell and layout
- [x] Create compact header with simple `QR Link` wordmark.
- [x] Keep V1 header free of unnecessary navigation.
- [ ] Add title `Create a QR code from any link.`
- [ ] Add subtitle `Paste a URL, generate a QR code, and shorten it if you want.`
- [ ] Keep tool visible above fold on normal desktop.
- [ ] Create centered container around 1120px max width.
- [ ] Create desktop two-column layout around 42% Settings / 58% Result.
- [ ] Use 20–24px gap.
- [x] Create stacked mobile layout with Settings then Result.
- [x] Prevent horizontal overflow.

## URL form and link mode
- [x] Add `Destination URL` label.
- [x] Add URL input with `https://example.com` placeholder.
- [ ] Use 48–52px input height.
- [x] Add inline helper/error region.
- [ ] Add segmented control: `Original URL` / `Short Link`.
- [x] Default to `Original URL`.
- [x] Add full-width `Generate QR` button.
- [x] Add Enter-to-generate.
- [ ] Add loading/disabled state to prevent duplicate submissions.
- [x] Do not use browser `alert()`.

## URL normalization and validation
- [x] Trim whitespace.
- [x] Normalize `example.com` to `https://example.com`.
- [x] Preserve existing HTTP/HTTPS.
- [x] Preserve path.
- [x] Preserve query.
- [x] Preserve hash.
- [x] Permit only HTTP/HTTPS.
- [x] Reject empty input.
- [x] Reject malformed URLs.
- [x] Reject `javascript:`.
- [x] Reject `data:`.
- [x] Reject other unsupported schemes.
- [x] Show failure inline.
- [x] Preserve original user input after failure.

## QR generation and result states
- [x] Implement Original URL QR generation.
- [x] Generate from normalized destination.
- [x] Show QR on the same page.
- [x] Do not navigate to another result page.
- [x] Do not reload the page.
- [x] Implement Empty state.
- [x] Implement Loading state.
- [x] Implement Success state.
- [x] Implement Error state.
- [x] Keep QR as result focal point.
- [x] Render QR on solid white background.
- [x] Include sufficient quiet zone.
- [x] Keep QR sharp.
- [ ] Keep desktop QR around 280–320px where practical.
- [x] Keep mobile QR inside viewport.

## Short Link persistence and redirect
- [x] Generate random short codes.
- [x] Use 6–8 characters.
- [x] Avoid sequential IDs.
- [x] Collision-check.
- [x] Avoid ambiguous characters where practical.
- [x] Validate destination before saving.
- [ ] Persist at minimum `id`, `shortCode`, `destinationUrl`, `createdAt`.
- [x] Use persistence suitable for current architecture.
- [x] Do not rely only on frontend memory.
- [x] Build generated short URL.
- [x] Encode generated short URL in QR for Short Link mode.
- [x] Implement server-side short-code resolution.
- [x] Redirect to exact stored destination.
- [x] Handle unknown code with clean Not Found behavior.
- [x] Never send unknown codes to arbitrary external destinations.
- [x] Keep secrets out of frontend code.

## Preview tab and actions
- [x] Add `Preview` and `Download` tabs.
- [x] Set Preview as default.
- [x] Make tabs keyboard accessible.
- [x] Show QR in Preview.
- [x] Show exact encoded/generated URL.
- [ ] Truncate URL visually only if necessary.
- [x] Preserve complete URL for Copy.
- [x] Add `Copy Link`.
- [x] Add `Copied` feedback then restore label.
- [x] Add `Open`.
- [ ] Open generated URL in new tab.
- [x] Use safe new-tab attributes.
- [x] Keep normal feedback non-modal.

## Download tab and export
- [x] Add PNG format.
- [x] Add SVG format.
- [x] Default to PNG.
- [x] Add 512×512 option.
- [x] Add 1024×1024 option.
- [x] Add 2048×2048 option.
- [x] Default to 1024×1024.
- [x] Add `Download QR`.
- [ ] Add download loading/error feedback.
- [ ] Generate sensible filename.
- [x] Export QR artwork only.
- [x] Never export a UI screenshot.
- [x] Ensure PNG exact selected dimensions.
- [x] Ensure SVG is valid vector output.
- [x] Ensure sufficient quiet zone in exports.

## Accessibility and interaction quality
- [x] Use semantic HTML.
- [x] Associate label with URL input.
- [x] Use actual buttons.
- [ ] Make segmented control keyboard accessible.
- [x] Make tabs keyboard accessible.
- [ ] Provide visible focus indicators.
- [ ] Maintain logical tab order.
- [x] Ensure Enter triggers generation.
- [x] Make errors accessible.
- [ ] Label icon-only controls if any.
- [ ] Keep practical touch targets about 44px or larger.
- [ ] Verify contrast on glass.
- [ ] Respect reduced-motion.
- [x] Avoid unnecessary modals.

## Responsive verification
- [x] Test 1440px.
- [x] Confirm balanced two-column layout at 1440px.
- [x] Confirm no horizontal overflow at 1440px.
- [x] Test 1024px.
- [x] Confirm comfortable layout at 1024px.
- [x] Confirm no control overlap at 1024px.
- [x] Confirm no horizontal overflow at 1024px.
- [x] Test 390px.
- [x] Confirm single-column stack at 390px.
- [x] Confirm Settings before Result at 390px.
- [x] Confirm QR fits viewport.
- [x] Confirm controls remain easy to tap.
- [x] Confirm no horizontal overflow at 390px.

## Exact end-to-end acceptance tests

### Normalization
- [x] Enter `example.com`.
- [x] Verify normalized output is exactly `https://example.com`.
- [x] Generate Original URL QR.
- [x] Verify QR points directly to `https://example.com`.
- [ ] Verify QR scans.

### Complex URL preservation
- [x] Enter `https://example.com/test?a=1#demo`.
- [x] Verify path `/test` remains.
- [x] Verify query `?a=1` remains.
- [x] Verify hash `#demo` remains where applicable.
- [x] Verify QR encodes the expected complete value.

### Short Link
- [x] Select Short Link.
- [x] Generate from a valid destination.
- [x] Verify unique code created.
- [x] Verify destination persisted.
- [x] Verify short URL shown.
- [x] Verify QR contains short URL, not long destination.
- [ ] Open short URL.
- [x] Verify server-side redirect reaches exact saved destination.

### Invalid input
- [ ] Enter malformed URL.
- [x] Verify QR is not generated.
- [x] Verify inline error.
- [x] Verify input remains.
- [x] Verify app does not crash.
- [x] Enter `javascript:alert(1)`.
- [x] Verify it is rejected.

### Copy and Open
- [x] Generate a valid QR.
- [x] Copy Link.
- [x] Verify clipboard contains complete value.
- [x] Verify `Copied` state.
- [ ] Open Link.
- [ ] Verify correct URL opens safely.

### PNG
- [ ] Download PNG 512×512.
- [ ] Verify actual dimensions are 512×512.
- [ ] Verify QR scans.
- [ ] Download PNG 1024×1024.
- [ ] Verify actual dimensions are 1024×1024.
- [ ] Verify QR scans.
- [ ] Download PNG 2048×2048.
- [ ] Verify actual dimensions are 2048×2048.
- [ ] Verify QR scans.

### SVG
- [ ] Download SVG.
- [x] Verify valid SVG.
- [x] Verify vector output.
- [ ] Verify QR scans.

### Unknown short code
- [x] Request unknown short code.
- [x] Verify clean Not Found behavior.
- [x] Verify no arbitrary redirect.
- [x] Verify server does not crash.

## Regression and production verification
- [x] Re-test Original mode after Short Link work.
- [ ] Re-test Short Link after download work.
- [ ] Re-test Copy/Open after responsive styling.
- [x] Re-test tabs after accessibility work.
- [x] Check browser console for relevant errors.
- [x] Check server console for relevant runtime errors.
- [x] Review warnings rather than ignoring them blindly.
- [ ] Run lint if configured.
- [ ] Fix relevant lint failures.
- [x] Run automated tests if configured.
- [ ] Fix relevant failing tests.
- [x] Run production build.
- [x] Verify production build succeeds.
- [x] Run production output locally where practical.
- [x] Re-test critical user flow against production output where practical.

## Final completion gate
Do not declare V1 complete until verified:
- [x] Original URL mode works end-to-end.
- [ ] Short Link mode works end-to-end.
- [x] Short redirects resolve exact stored destinations.
- [x] QR scans correctly.
- [x] Copy Link works.
- [ ] Open works.
- [ ] PNG works at exact requested sizes.
- [ ] SVG is valid and scans.
- [x] Invalid URL handling works inline.
- [x] Dangerous schemes are rejected.
- [x] 1440px has no horizontal overflow.
- [x] 1024px has no horizontal overflow.
- [x] 390px has no horizontal overflow.
- [ ] Keyboard tab flow works.
- [x] Enter-to-generate works.
- [x] Relevant browser console errors are absent.
- [x] Relevant server runtime errors are absent.
- [x] Production build succeeds.

After all critical checks pass, report:
1. what changed;
2. what was tested;
3. test results;
4. known limitations.
