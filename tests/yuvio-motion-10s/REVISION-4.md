# YUVIO — full walkthrough, revision 4

74 seconds total: approved 15-second opening plus 59-second continuation. 2560×1440, 60 fps, 4,440 frames, H.264/AAC, CRF 15. Existing composition ID YuvioMotionTest and project folder retained for the open Studio tab.

## Direction and continuity

The opening animation is unchanged. A new component begins at frame 900, matching the previous Home composition and background phase. The first 15 seconds use the existing sound file unchanged. Continuation sound is original synthesized ambience with cues aligned to authored clicks.

The motion thesis is interaction-led navigation, with three focal moments: QR camera focus, physical exchange confirmation and the original frozen texture spreading across the card. Receipt and settlement reveal as separate layers. Other camera moves are restrained, with full-screen holds around actions. Pointer movement pauses between actions.

See CONTINUATION-BRIEF.md for the user's brief and timeline-v4.json for scene timings. Left-side continuation headings and descriptions are provisional; the user intends to supply final copy.

## Authentic assets and states

All screen PNGs are 4× Figma exports from the Design section, 1608×3496 pixels. The original QR is scaled uniformly; its structure is never regenerated. All financial values and masked card fields remain as in Figma.

- Receive: 126:470
- Exchange: 163:688
- Exchange Success: 175:641
- Receipt: 245:675
- Card: 90:437
- Frozen Card: 99:448
- Card Details: 164:682
- Activity: 146:515
- Netflix Transaction Details: 164:607
- Profile: 131:481
- Face ID Setup: 135:492

Receipt paper, settlement rows, card artwork, freeze texture, control state and paused-payment notice animate as separate original-pixel layers. Lightweight SVG clean plates derive from the same Figma exports with the animated groups removed locally; Onest is embedded. Navigation icons and labels derive from Figma; the active pill moves between the original tab positions. No Figma nodes were edited.

## Intentional constraints

No received-payment success, revealed card numbers, completed Face ID setup, filtered transaction list or PDF-download completion was invented. Face ID remains off; Not now returns to Profile. Activity remains All and retains the original historical transactions, including the existing processing transfer to Nikita; no new transaction was fabricated to represent the preceding Angelina scene. Approved screen balances are retained rather than rewritten.

Most UI content remains exported pixels, with animated interaction layers. This is a product film demonstration, not a working banking application. Freeze uses a masked reveal of the supplied frost asset, not a new procedural ice simulation. The brief's optional Face ID contour was omitted to preserve the original image.

Earlier MP4 revisions remain in deliverables/. Sources of the approved opening remain in Git history.

## Final export validation

- H.264 video / AAC audio; 2560×1440, 60/1 FPS, 4,440 video frames.
- Video duration 74 seconds; container duration 74.005 seconds; 61,182,746 bytes.
- Entire file decoded successfully with the bundled FFmpeg, using rawvideo / PCM output to the null muxer. Its default wrapped_avframe output is disabled, so explicit output codecs were required for that check.
- Inspected 17 decoded frames covering the opening/continuation boundary, QR focus, exchange drag, settlement, receipt reveal, freeze/unfreeze, hidden card fields, activity, Netflix details, profile, Face ID off, profile return and the final hold.
- The adjacent decoded frames at 14.983 s and 15.000 s have a mean per-channel pixel difference below 0.3/255, consistent with a continuous composition at the boundary.
- Asset dimensions checked for all 11 new screens; all are 4× exports. Layer SVGs parsed successfully and runtime assets are local.
- Remaining review item is creative feedback and the user's final left-side copy; no missing screen states were invented.
