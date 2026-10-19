# YUVIO V6 — glass, gradients, motion and pacing

68 seconds / 4080 frames / 2560×1440 / 60 FPS.

## Glass fidelity

The card control SVGs preserve Figma surface fills, rounded outlines, labels, icon geometry and state styles. Their exported Figma blur metadata cannot sample DOM siblings. A real CSS backdrop-filter layer now samples the card/background underneath: blur(14px), saturation 112%, 382×169 at (10,337), corner radius 27. It is placed behind the original control SVG, in both Active and Frozen states. The original neutral Unfreeze state and Active accent are retained.

## Background and light

The old soft-light tiled noise and CSS radial gradient stack were replaced with five full-frame 2560×1440 PNG fields generated in float64, then rounded with fixed fine sub-LSB spatial dither. The noise is monochromatic, seeded and fixed to composition pixels: no temporal grain or moving noise tile. Gaussian colour fields change via long smooth crossfades, preserving the indigo/violet palette. No procedural glow noise or added ice texture is used.

The device's all-child drop-shadow filter was replaced with one clean box-shadow on its rounded body. This also avoids making the entire screen content part of a filtered offscreen surface around the backdrop layer. Original Figma UI content remains intact.

## Editorial motion and timing

A C1 monotone cubic Hermite time map shortens the 88-second V5 to 68 seconds without discontinuous frame jumps. All screen changes, gestures, status transitions and copy follow the same virtual clock. Camera choreography is separate: most sections use a static hold, Exchange uses a lateral drift, Details/Transaction use small positional shifts, Send/Receipt use only slight scale changes and QR retains the main controlled zoom.

No cursor was reintroduced. Existing touch feedback, swipe confirmation, Freeze/Unfreeze state logic, protected card fields, Face ID off, and the current Transaction Details 212:840 are preserved.

See src/motionV6.ts, v6-timeline.json, tools/audit_v6.cjs and v6-motion-audit.json. The audio is recomposed at the new cue times with unchanged oscillator pitches and effect envelopes; it is not a speed-shifted V5 mix. Source mix is normalized to −16 LUFS.

## Rendering pipeline

Render from PNG frames into a ProRes HQ 10-bit 4:2:2 intermediate, then encode the high-quality H.264 MP4 and an HEVC Main 10 archival copy from that intermediate. Browser/Figma inputs remain SDR 8-bit; a 10-bit intermediate reduces later quantization, it does not invent HDR or extra source detail.

ProRes is a local working intermediate due to its large size. Final delivery files and all editable sources are stored in GitHub. Final encoded measurements and checks will be appended after export.
