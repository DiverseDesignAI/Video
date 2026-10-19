# Test report / 2026-10-19

## Delivery

- MP4: ../../deliverables/yuvio-test-10s.mp4
- Video: H.264, 2560 × 1440, 60 fps, 600 frames (10.000 s).
- Audio: AAC, original ambient bed and touch cues. Muxed container duration 10.005 s.
- File size: 4,719,130 bytes.
- Render: approximately 1 minute 40 seconds on this machine, concurrency 3.
- First preparation + validation + rendering: approximately 9–10 minutes, including export troubleshooting. This is not a repeat-render benchmark.

## Usage observations

Account-wide used percentages at start and after render:

| Window | Start | After render | Change |
|---|---:|---:|---:|
| Five hours | 30% | 47% | +17 percentage points |
| Weekly | 5% | 7% | +2 percentage points |

These are shared rounded account counters, not exact token or money charges for this video. They were read before final GitHub delivery. Do not multiply the deltas by three to estimate a 30-second film: setup, context reading and troubleshooting are included.

## Problems encountered and addressed

1. Initial Figma screenshot URLs fetched through the Python client produced zero-byte files. Asset exports downloaded through curl/Node worked; dimensions and sizes were verified.
2. PNG exports of isolated logo/control contained a flattened background. Switched to original SVG assets, preserving logo geometry and transparent control edges.
3. The Transfer Sent screen mixes Completed with awaiting-bank language. Excluded that screen; the sample ends on the existing confirmed swipe state.
4. Local rendering worked with installed Chrome and Remotion's bundled media tools. No additional system-wide build tools were installed.

## Verification and limitations

Rendered and inspected source frames; checked decoded MP4 frames at 3.2, 5.4 and 9.7 seconds; verified codec, dimensions, frame count, fps, duration and audio-stream presence. No full perceptual audio review was performed.

The sample uses three genuine 4× screen exports, animated navigation/tap overlays, a separately animated original vector thumb, a reconstructed confirmation bed, and subtle frame-driven background/camera movement. It does not yet animate every internal UI layer, number entry, live recalculation or backend behavior. It covers one fragment, not the full 30-second portfolio film.
