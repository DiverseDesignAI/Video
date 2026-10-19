# YUVIO / Product walkthrough

2560 Г— 1440 В· 60 fps В· 4080 frames В· 68 seconds В· Remotion 4.0.536.

## Current revision

**V7: 68 seconds, 4080 frames, 1440p60.** Larger Onest typography, a readable 5.3-second introduction, original UI Kit press states, two deliberate recipient switches, synchronized receipt entry and the complete Freeze / Unfreeze cycle. The V6 phone shell, approved palette, glass panel and current Transaction Details **212:840** remain intact.

See [REVISION-7.md](REVISION-7.md), [V7-REVISION-NOTES.md](V7-REVISION-NOTES.md), [v7-timeline.json](v7-timeline.json), [v7-source-qa.json](v7-source-qa.json), and [v7-motion-audit.json](v7-motion-audit.json).

Delivery export is in progress. H.264 targets 30 Mbit/s; an additional high-quality HEVC Main 10 copy is encoded from the same working master. Final measurements are recorded in v7-export-validation.json after export. Large V7 videos use Git LFS; browser download links provide the actual video.

The live composition is still named YuvioMotionTest to preserve the existing Studio link. Its entry point is src/YuvioV7.tsx; V5/V6 sources are retained as prior revisions.

## Original 10-second test (historical)

Home в†’ tap Send в†’ select Nikita в†’ show amount and fees в†’ slide to confirm. This is an animation test, not a functioning banking app. It ends on the confirmed control, before the unresolved Transfer Sent / Completed screen.

The three full-screen images are genuine Figma exports at 4Г— (1608 Г— 3496). Screen transitions, camera motion, tap feedback and the confirmation thumb are animated separately. Most internal UI layers remain raster images; this does not yet implement an entirely live UI. The small confirmation track is reconstructed from the original Figma geometry and paints; its thumb is an original vector export. No Figma nodes were changed.

## Initial source assets (historical)

File: https://www.figma.com/design/xdHhVrICh4tuIjB1bTbsxh/

- Home: 53:1562
- Select Recipient: 122:459
- Send Money: 163:574
- White logo: 350:733 (original SVG)
- Swipe thumb: 219:665 (original SVG)
- Font: Onest, Google Fonts; SIL OFL in public/Onest-OFL.txt
- sound.wav: original synthesized ambient bed and tap cues, generated for this test; no third-party music.

No temporary Figma URLs are used at runtime.

## Run

Node.js 22+ and Git LFS. Run npm ci, then npm run preview. Source validation: npm run audit:v7.

For the quality pipeline, run npm run render:master, then tools/encode_v7.ps1 with -Master pointing to out/yuvio-v7-master.mkv and -OutputDirectory pointing to your delivery folder. The script uses NVIDIA NVENC; an equivalent software encoder can be substituted on other hardware. npm run render is a direct H.264 alternative; its rate control differs from the verified two-stage export.

On this Windows machine the existing Chrome executable is C:/Program Files/Google/Chrome/Application/chrome.exe. Pass the browser-executable option when rendering with that installation. Dependencies, render caches and working masters are excluded from Git.

## Known limitations

- A moderate camera move rather than elaborate 3D staging.
- Values are the prepared Figma state; amount entry and recalculation are not demonstrated.
- No claim of settled transfer or enabled biometrics.
- The first run included setup and Figma-export troubleshooting, so its total elapsed time is not a clean measure of subsequent render time.
