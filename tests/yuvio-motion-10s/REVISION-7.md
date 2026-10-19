# V7 Р Р†Р вЂљРІР‚Сњ Typography, Interaction & Motion Refinement

Incremental revision of V6. Original V5/V6 implementation and assets remain available. The current Studio composition uses YuvioV7.tsx / ScreensV7.tsx / motionV7.ts.

## Timing and typography

68 seconds / 4080 frames / 2560Р вЂњРІР‚вЂќ1440 / 60 FPS. Intro builds over 0Р Р†Р вЂљРІР‚Сљ2.2 seconds, holds fully readable over 2.2Р Р†Р вЂљРІР‚Сљ4.2, and continuously resolves into Home over 4.2Р Р†Р вЂљРІР‚Сљ5.3. Later Card Details and other idle holds are shortened to retain the total duration.

Onest headings are 112 px / 700; descriptions 42 px / 400 with a fixed 38 px separation. The column is 1160 px wide at x=180. All 16 caption entries use manual semantic line breaks and were measured in the actual browser: no overflow. One lavender line is the accent. Captions hold through the touch, then use a short sequential fade-out / fade-in. Old and new headings never overlap; all 415 boundary frames were verified in the live browser.

## Original component states

Read the source UI Kit on 20 October 2026. See v7-kit-provenance.json for original component IDs and paint/effect metadata.

- Primary and secondary Pressed variants 316:702 / 316:718: original fills and strokes, opacity .8, effects removed. Original SVG exports are retained. Local Go home / Done label derivatives embed the approved Onest font.
- Back Pressed 316:742: original purple surface #393455 and original arrow; no black touch overlay.
- Card Action Pressed 322:756 / 322:761: opacity .72, effects removed. This treatment is applied to separately extracted original screen action tiles so the approved Active accent and Frozen/Unfreeze icon and label stay intact. The panel and status remain separate from the changing actions.
- Bottom Navigation 320:896 has selected-tab variants, not a Pressed variant. The existing selected indicator moves only when the route changes. A brief light touch outline does not change the selected section.
- Pressed reactions last up to 160 ms in real video time and end immediately if the product state changes, independent of the editorial clock. No full-screen dim, black overlay, or tap-sized raster cutout is used. Component alpha compositing masks only the exact rounded native-button outline.

## Product continuity

Recipient sequence is Angelina Р Р†РІР‚В РІР‚в„ў Nikita Р Р†РІР‚В РІР‚в„ў Angelina: two deliberate swipes, dwell, then an explicit tap. The original five pagination dots are retained, advancing through the three shown contacts (positions 3РІР‚вЂњ5). Final selection, Send Money and Transfer Sent consistently use Angelina Firsova and the prepared original transaction values. Activity remains the existing historical list, not a fabricated newly added transfer.

Receipt artwork is present from the first incoming transition frame; the paper and containing screen move together, with a small clipped lift rather than an empty loading state or a height-zero reveal.

Active Р Р†РІР‚В РІР‚в„ў Pressed Freeze Р Р†РІР‚В РІР‚в„ў Frozen Р Р†РІР‚В РІР‚в„ў Pressed Unfreeze Р Р†РІР‚В РІР‚в„ў Active retains original status, labels, information message and frost asset. Original controls are split into panel/status and three action tiles. The CSS backdrop-filter remains behind the panel and never blurs labels or icons. Frozen state remains until the departing frost texture has fully cleared.

The original iPhone shell, Dynamic Island, screen clipping and safe margins are preserved. Status-bar and home-indicator crops are composited after routed page transitions so they stay fixed while the interface moves. Send and Card are about 12% larger than V6; other scenes remain quieter. Transaction Details still uses only 212:840 and the original YUVIO virtual card.

## Colour, audio and export

Approved V6 gradient geometry and palette are recomputed in float64 and stored as full-resolution RGB 16-bit PNGs. Identical fixed mono sub-level dither is used across fields; no moving grain. Browser compositing remains SDR and may quantize to 8-bit; the pipeline does not claim true HDR or invent source detail. PNG rendering feeds a ProRes HQ 10-bit 4:2:2 working master in MKV, avoiding the unnecessary MOV fast-start relocation that delayed V6.

Final compatible H.264 targets 30 Mbit/s CBR; a separate high-quality HEVC Main 10 copy comes from the same master. Neither copy is described as mathematically lossless. Encoding: tools/encode_v7.ps1. Large deliveries use Git LFS rather than lowering quality to fit a regular Git blob.

The original synthesized score is recomposed with V7 cue times, not speed-shifted. Tap cues, contact swipes, confirmation, freeze/unfreeze and logo cues use the revised real clock. Source normalization is -16 LUFS; encoded measurements are recorded after export.

## Validation

v7-motion-audit.json checks all 4080 samples, monotonic time, safe phone bounds, frost/state consistency, 160 ms press reset, two contact swipes and matching final recipient. v7-timeline.json / v7-cues.json retain reviewable timing. Final encoded validation will be recorded separately after export.

The final picture retains unaffected ProRes master frames and replaces only the final typography/state windows listed in v7-refinement-windows.json. The assembly uses frame-boundary timestamps, concat metadata selection and a 1/60000 timing base before CFR encoding. The original full PCM score is mapped separately without audio edits at the picture boundaries. Fresh renders from the final source do not require this incremental assembly.
