# YUVIO V9 — final interaction and transition fixes

This revision preserves the approved 68-second timeline, 2560 × 1440 / 60 FPS composition, phone, captions, backgrounds, QR animation, currency exchange, Freeze/Unfreeze direction, current Transaction Details and ending.

## Root cause: black navigation icons

The original Figma navigation SVG declares `fill="none"` on its root. V8 extracted the icon groups and recolored their strokes, but its replacement root omitted that inherited fill. SVG consequently filled closed Home, Card, Activity and Profile contours with default black. V9 restores `fill="none"` on the actual SVG root; no opaque patch, ripple or extra icon is added.

Root tabs now use the same vector navigation both during transitions and at rest. The embedded bitmap navigation is clipped out before the one vector instance is drawn. This avoids a handoff between a transition-only component and a different static selected state. The selected surface uses the supplied four-stop accent gradient in the original navigation gradient direction; the destination icon, label and selected position update atomically from the same route state. Its restrained .96 → 1 scale settle replaces the old traveling pill that briefly highlighted the previous icon after the new screen was open.

## Push/pop coverage

The full opaque backing screen stays beneath the moving foreground screen, with the existing iOS-style foreground movement and backing parallax. Removing the independently antialiased adjacent clip edges prevents a fractional-pixel crack revealing the dark display background. The phone display clips the stack, system status and home indicator remain pinned, and navigation belongs to its page when entering/leaving a nested screen. No global crossfade or decorative transition is introduced.

## Receipt timing

The existing 780 ms single-paper reveal begins with the receipt route, removing the previous 240 ms delay. A visible 84 px paper edge is present at the slot from the first receipt frame. The original two controls fade in together from +100 to +600 ms, while paper completes at +780 ms. The existing restrained camera focus follows the reveal. The same receipt cue is moved 240 ms earlier to match; music PCM outside the old/new cue region is bit-identical to V8.

## Export and verification

Explicit ANGLE remains required for browser rendering. Source QA covers 534 frames, including consecutive samples of all requested navigation, push/pop and receipt intervals, button reactions and Card state regressions. Navigation pixel checks target the reported accidental black fills, separately from visual review.

Delivery is encoded from a fresh ProRes HQ / PCM working intermediate. H.264 targets 30 Mbit/s. HEVC Main 10 uses NVENC QP0 / lossless tuning, preserving the prepared 10-bit 4:2:0 input without further quantization; actual video bitrate is 56.08 Mbit/s, versus V8's 3.5 Mbit/s. A 24 Mbit/s CBR target underfilled to about 4 Mbit/s, so the final quality copy uses explicit sample-preserving coding instead of relying on that target. Both are SDR BT.709, 68 seconds, 4080 frames. The browser PNG stage is 8-bit; the 10-bit intermediate/delivery does not invent additional source precision or imply HDR. Final encoded validation passed: both streams fully decode; 495 critical HEVC frames and 241 Card header checks pass; all 63 requested navigation frames contain zero accidental black icon pixels. Twelve 10-bit YUV samples match the prepared master input exactly. Three unobstructed dark-gradient samples differ from the approved background by an average 0.4535 of 255 RGB levels (99th-percentile error: 1 level). Thirty-eight encoded stills were visually reviewed. See v9-export-validation.json for hashes and measurements.
