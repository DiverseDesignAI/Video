# YUVIO / 10-second motion test

2560 × 1440 · 60 fps · 600 frames · Remotion 4.0.536.

## Current revision

Revision 3 extends the film to **15 seconds / 900 frames**: after Nikita, swipe to Angelina, send to her, show Transfer Sent, click Go home and return to Home. Headlines are heavier. Receive is planned next. See [REVISION-3.md](REVISION-3.md).

Current export: `deliverables/yuvio-transfer-v3.mp4`, H.264 CRF 15, 1440p60. Revision 1 and 2 MP4 files remain for comparison. The composition ID stays `YuvioMotionTest` for the existing Studio tab.

## Original scope

Home → tap Send → select Nikita → show amount and fees → slide to confirm. This is an animation test, not a functioning banking app. It ends on the confirmed control, before the unresolved Transfer Sent / Completed screen.

The three full-screen images are genuine Figma exports at 4× (1608 × 3496). Screen transitions, camera motion, tap feedback and the confirmation thumb are animated separately. Most internal UI layers remain raster images; this does not yet implement an entirely live UI. The small confirmation track is reconstructed from the original Figma geometry and paints; its thumb is an original vector export. No Figma nodes were changed.

## Source assets

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

Node.js 22+ recommended. `npm ci`, then `npm run preview` or `npm run render`.

On this Windows machine rendering used the existing Google Chrome executable, H.264, CRF 17, yuv420p and concurrency 3. Pass `--browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe"` when using that installation. On a fresh machine Remotion may need to install its rendering browser.

The test MP4 is stored in the repository's deliverables/ directory. Dependencies and caches are excluded from Git.

## Known limitations

- A moderate camera move rather than elaborate 3D staging.
- Values are the prepared Figma state; amount entry and recalculation are not demonstrated.
- No claim of settled transfer or enabled biometrics.
- The first run included setup and Figma-export troubleshooting, so its total elapsed time is not a clean measure of subsequent render time.
