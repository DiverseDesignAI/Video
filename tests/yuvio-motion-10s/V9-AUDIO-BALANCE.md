# V9 — music −35%, effects +15%

The music bus uses gain 0.65 (−3.742 dB), and the UI-effects bus uses gain 1.15 (+1.214 dB). The existing local preview's global gain 1.08 is preserved on both buses. No loudness normalization is applied after these changes, because that would undo the requested balance.

The original deterministic V7 generator reconstructs separate music and UI-effects buses. Music passes through the original shared mastering transfer at its existing gain; effects retain the compressor interaction, all approved cues, the V9 receipt reveal and PCM residual. The saved two PCM buses sum exactly to the approved V9 soundtrack before the new gain factors. The reconstructed original generator matches the earlier V7 master to within one PCM rounding unit.

Preview exposes the two audio buses separately. Export copies the original V9 coded video stream and replaces only its audio. SHA-256 equality of both full video elementary streams confirms that no animation, color, timing or coded video data changed. Both files fully decode and retain 68 seconds / 4080 frames / 2560 × 1440 / 60 FPS.

Final AAC audio: approximately −18.99 LUFS and −7.25 dBTP, with no overload. Reproduce with `tools/rebalance_v9_audio.py --output-dir <temporary output directory>`; existing V9 delivery inputs must be present in Git LFS cache or deliverables/. See v9-audio-balance-validation.json for exact hashes and measurements.
