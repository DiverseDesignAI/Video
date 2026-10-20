# YUVIO V8 — targeted interaction fixes

Preserve the approved V7 composition, 68-second / 4080-frame timeline, 2560 × 1440 / 60 FPS format, typography, background palette, transaction data, recipient and music. V8 is an incremental technical revision.

## Single-instance controls

Original Figma component exports provide the actual surface, icons and outlined lettering. Each original surface is excluded from the flattened page and rendered once against its own original Figma backdrop. Pressed interpolates that surface's fill in place; it does not crossfade two buttons, add a highlight rectangle or dark overlay. The accent gradient uses #AE9FFF / #806FE9 / #6150CE / #45369A at 0 / .42 / .82 / 1 with the original UI Kit vector direction and uniform scaling to preserve its angle. Secondary controls, rows and back glyphs retain their distinct treatment. The existing 160 ms reaction timing is preserved. Card controls scale to .98 during the press and return to neutral.

Source nodes: Home quick actions 56:433 / 56:437 / 56:441; Transfer Sent Go home 440:4135; View receipt 175:695; receipt Go home / Download PDF 245:776 / 245:780; transaction Done 212:878; Face ID setting 131:547; Not now 135:566; Netflix activity row 146:577; Receive Back 126:476; Card Details Back 164:685. Read-only exports only; Figma is not modified.

## Opaque transitions

Result and tab handoffs no longer blend two readable interfaces. Push and pop retain their existing motion but use disjoint outgoing/incoming clips. Bottom navigation draws one set of original icon paths and labels with one moving selected indicator. System status and home indicator remain pinned.

## Fixed Card geometry and state model

The card silhouette is fixed at x39 / y198 / 324 × 169 / radius18 in the 402 × 874 UI. Independent parallax is removed. Normal and frozen materials occupy mutually exclusive regions inside the same silhouette, without duplicate lettering from alpha compositing. The approved frozen image is aligned to the same physical card border rather than stretched with object-fit: cover.

One model owns material, status, Freeze/Unfreeze and the informational note: active → freezing → frozen → unfreezing → active. Material changes last 280 ms after the existing button reaction. Frozen is committed only after freezing completes; Active returns on the same frame that unfreezing finishes. The original glass panel keeps live CSS backdrop blur, translucent material and sharp foreground labels/icons.

## Digital receipt reveal (user addendum 09)

The existing printer slot and original receipt artwork are retained. Paper is cropped once to its own 330 × 551 bounds before moving inside a second fixed clip. This prevents controls from the full source screenshot entering the moving paper layer. A 28 px paper stub is visible from the initial incoming frame; the 780 ms reveal begins 240 ms after the route starts, with natural acceleration and deceleration. Go home and Download PDF reveal together; their original base groups and shadows are removed before drawing each control once. After paper settles, the whole device receives a restrained .045 focus increase, then returns to full framing. No text is scaled independently or financial data changed.

The approved V7 mix is retained with one quiet 780 ms original synthesized cue synchronized to paper movement. No literal printer noise or external sample is used; output remains about −16 LUFS.

## Rendering and verification

Chrome's automatic graphics backend reproduced missing-layer artifacts around material clips. Explicit `--gl=angle` fixes the observed failure and is required by `tools/render_v8.ps1`. Figma XHTML foreignObject blur wrappers are removed before inline HTML parsing; actual backdrop blur is handled in CSS. This also fixes swallowed SVG content in secondary actions.

Before the full export: 443 raster samples cover critical intervals and press windows; 100 Card samples pass the stable-header completeness check. The final receipt reveal is additionally rendered as 74 consecutive frames after its crop correction. Native DOM checks confirm unique controls, one paper layer and no foreignObject wrappers. Accent fill direction is verified in a final press keyframe. Final encoded validation is recorded separately after rendering, not inferred from preview checks.

Working master: 10-bit ProRes HQ / PCM from current source, not transcoded from V7 MP4. This is a high-quality working intermediate, not an uncompressed or mathematically lossless master. Deliveries are H.264 at approximately 30 Mbit/s and HEVC Main 10, with the same 68-second duration. Final export is pending until the validation report is produced.
