# YUVIO V5 — 88-second product walkthrough

2560×1440 / 60 FPS / 5,280 frames / H.264 CRF 15 / BT.709 / stereo AAC 320 kbit/s.

## Implemented direction

The existing Remotion project, font and genuine YUVIO assets remain the foundation. V5 replaces the V4 animation implementation, rather than preserving its transition errors. V4's exported MP4 and prior sources remain in Git history for comparison.

- Continuous four-second brand introduction: original violet SVG mark, Onest wordmark and approved copy transition into the product composition. The logo's aspect stays fixed.
- Authored front-view black-titanium iPhone 16 Pro mockup: thin layered metal frame, screen placement, Dynamic Island, side controls, low glass reflections and a natural offset shadow. It is an editable geometric mockup, not a photographic Apple render. The body ratio follows Apple's 71.5×149.6 mm dimensions; display artwork retains its 402:874 aspect. Reference: https://support.apple.com/en-ie/121031 .
- Every main-device frame stays inside the audited safe bounds; full-body phone camera motion replaces V4's clipped zooms.
- One physical device during navigation. Push and pop use opposite directions with a single outgoing screen and an opaque destination. There are no duplicate phone wrappers during app transitions.
- No mouse cursor. Button presses use brief masked crops of original controls, scale/brightness feedback and a short low-opacity touch indicator. Pressed states reset after 170 ms.
- Contact browsing uses original transparent image fills, independently animated names, original aura and pagination, with a visible touch gesture during each drag. Angelina remains the chosen recipient.
- Send and exchange confirmations travel continuously across the original track using a symmetric eased drag; text clears before the thumb reaches it.
- Frozen surface, status, neutral Unfreeze control and paused-payment notice follow one state timeline. Active styling returns only after the frost disappears. The supplied frost image is used; no new ice texture was generated.
- Receipt, exchange settlement and current transaction card/payment proof/details/reference are independent original design layers.
- All approved headings and descriptions are present. The latest transaction headline and description supersede the conflicting attached brief. Text is Onest, 96 px headings and 34 px descriptions.
- Face ID stays off, masked card information stays masked, and no QR scan, received-payment success, biometric success or PDF-download completion is invented.
- Six-second three-device outro, original logo, approved slogan and final hold.

## Critical transaction correction

The active transaction screen is **212:840**, with a YUVIO virtual card as hero. Netflix is only a merchant label. Amount −$15.99, Completed, Visa •••• 4826, fees $0.00 and reference YUV-CARD-2026-0142 match Figma. Done returns to Activity. See V5-TRANSACTION-OVERRIDE.md.

The old dormant V4 cursor component and public transaction.png were removed from the current project. Historical V4 reports and videos are archival records; they are not loaded by the V5 root.

## Timing

0–4 Intro; 4–9 Home; 9–14 Recipient; 14–20 Send; 20–24 Transfer Sent; 24–32 Receive; 32–40 Exchange; 40–44 Exchange Success; 44–49 Receipt; 49–56 Card; 56–62 Freeze / Unfreeze; 62–68 Details; 68–75 Activity / Transaction; 75–82 Profile / Face ID; 82–88 Outro.

Exact interactions and routes are editable in src/motionV5.ts. Financial source fixtures, including screen balances and historical Activity entries, are preserved. Send's two existing Nikita placeholders are corrected locally to the previously chosen Angelina, as already authorized in this session; Figma was not edited.

## Sound

A new original minimal electronic score and UI effects were synthesized for this film, with no external recordings, stock music, samples, paid generation or third-party audio licenses. Music and effect stems, generator and mastering measurements are saved in assets/audio/v5 and tools/compose_v5_audio.py. No QR scan or false Face ID completion sound is used.

Source WAV: stereo 48 kHz, −16.00 LUFS integrated, −4.03 dBTP measured with 4× oversampling. The final encoded AAC will be checked separately. Stem files are unmastered; the generator applies soft compression and integrated normalization to the final mix.

## Verification performed before final render

- Current Figma screens and control states re-inspected; fresh 4× screen exports in public/v5.
- Current transaction source and financial/reference fields visually checked.
- Stills checked at intro, intro-to-product, recipient browsing, button press, card, frost onset, frozen hold, unfreeze, restored Active, transaction and outro.
- Short encoded Activity → Transaction → Done → Activity draft inspected at key points.
- All 5,280 camera/state samples audited: safe device bounds, no frost/control contradiction, no mouse pointer in the active import graph, correct Done destination. See v5-motion-audit.json and tools/audit_v5.cjs.
- Final render and encoded audio validation will be appended after export.
