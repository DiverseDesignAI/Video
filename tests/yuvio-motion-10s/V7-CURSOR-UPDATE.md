# V7 cursor, Card states and typography revision

The final full-length V7 export was rendered from source commit c1c71db on 20 October 2026. Both published V7 MP4s now include this cursor, Card and typography revision. Earlier exports remain available in Git history.

- One demonstration cursor, lavender #C1B7FF, rounded asymmetric vector silhouette, approximately 44 px wide at 2560 × 1440. The reference image was not attached to this request; the silhouette follows the supplied written shape description.
- Cursor position is anchored to its visible tip in composition space, with approach deceleration, 6.5% press compression and short fades. It appears for 19 taps, two contact drags and two complete 300 UI-pixel confirmation swipes. Passive scenes remain clear. Card targets are placed beside their labels to keep the lettering visible.
- Fresh read-only Figma exports from UI-10 frame 90:437: Details 91:449, Freeze 384:855 (layer name says Unfreeze; actual text says Freeze), Settings 91:459. Their neutral surfaces replace the previous active-card tiles. Selected Card navigation stays separate. Frozen/Unfreeze continues to use its approved original screen; transient pressed opacity .72 follows UI Kit Card Action variants. Existing live backdrop blur remains intact.
- Fresh exports use separate asset URLs to prevent stale Studio image caches. Both the main journey and the closing side phone use the corrected Card component.
- Onest headings increased from 112 to 128 px; descriptions from 42 to 48 px, column 1190 px, left margin 180 px. Manual semantic line breaks, #F6F4FF / #C1B7FF title hierarchy and #B7B5CC descriptions. Caption handoffs remain sequential, without overlapping ghost text.
- Existing 68-second timeline, 1440p60 composition, camera scale, soundtrack and approved transaction screen 212:840 are preserved.

Validation: existing 4080-frame motion audit and dedicated cursor audit pass; nineteen representative frames rendered, including all sixteen caption sections and card interaction states. Additional final samples check confirmation swipes and corrected closing Card. Studio reports no error. Mechanical Impeccable detector reports no findings for changed visual components.

Final encoded validation: both MP4s fully decode, 2560 × 1440, 60 FPS, 4080 frames, exactly 68 seconds. H.264 delivery is 29.912 Mbit/s and 257,113,394 bytes; HEVC Main 10 delivery is 32,585,352 bytes. Both encoders report zero duplicated or dropped frames. Audio measures −16.008 LUFS and −4.725 dBTP. Twenty-five decoded frame samples were inspected across the complete journey. Exact file hashes and source fingerprints are recorded in `v7-export-validation.json`.

Delivery commit: f18b27f994d61f4ef03d072f488449d92358921d. Both public media download URLs returned HTTP 200, with exact byte lengths and ETags matching their SHA-256 hashes. Only after this verification, the local ProRes master, duplicate outputs, sampled PNGs and temporary audio/progress files were removed (33 files, 6,139,486,646 bytes). Sparse checkout was reapplied to keep published deliverables out of the editable working folder; source and project assets remain available locally.

Run `node tools/audit_v7.cjs` and `node tools/audit_cursor_v7.cjs` from this project. `tools/prepare_v7_assets.py` includes the current Card export derivatives so regeneration preserves the corrected neutral state.
