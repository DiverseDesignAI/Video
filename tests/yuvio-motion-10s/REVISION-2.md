# YUVIO motion test — revision 2

10 seconds, 2560 × 1440, 60 fps. Keeps revision 1 for comparison.

- Visible custom pointer, press feedback and synchronized drag gestures.
- Recipient sequence: Angelina → Ilya → Dmitriy → Nikita; animated pagination.
- Larger Onest headlines; removed Product design concept.
- Confirmation: ready label fades before thumb crosses it; no dragging label; Transfer sent appears after completion.
- Deterministic subtle dithering and CRF 15 export to reduce gradient banding. Displays/platform recompression may still affect dark gradients.
- Sound cues retimed to the visible actions.

Figma recipient frames exported at 4×: 437:4033, 435:3766, 435:3855, 437:3944.
Updated Send frame 163:574 contains Angelina in its recipient row but Nikita in its amount copy. The film keeps the previously approved Nikita send layout and updates the portrait to match the selected recipient. Figma was not modified.

The UI is a deterministic film demonstration using approved screen exports and animated interaction layers; it is not a working payment application.

Validation: final MP4 inspected at carousel and confirmation points; 600 frames, 2560×1440, 60 fps, H.264/AAC, 10.005 s mux duration, 8,138,182 bytes.
