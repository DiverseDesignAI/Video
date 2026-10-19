---
name: editly-video
description: Assemble videos, images, titles and audio into MP4 or GIF using Editly and JSON edit specs. Use when the user requests Editly or clip-based montage, rather than precise UI animation.
---
# Editly video montage
This is a custom skill, not an official mifi skill. Source: https://github.com/mifi/editly .

Use a project-local npm dependency (`npm install --save-exact editly`), not a global installation. Check Node compatibility and `ffmpeg -version`, `ffprobe -version`. Native canvas and headless-gl dependencies may require a supported Node release and build tools; never claim installation succeeded when npm failed. Prefer a compatible Linux CI environment if the Windows build fails.

Describe the edit in a JSON/JSON5 file with explicit width, height, fps, outPath and clips. Each clip has duration and layers; supported basic layers include fill-color (color), title (text), image (path), video (path). Specify defaults.transition: null for a transition-free baseline. Add transitions and audio after baseline verification. Clip duration can retime video; use cutFrom/cutTo intentionally. Remote requests are off by default; use authorized assets.

Example:
```json
{"outPath":"out/demo.mp4","width":640,"height":360,"fps":25,"defaults":{"transition":null},"clips":[{"duration":2,"layers":[{"type":"fill-color","color":"#17132e"},{"type":"title","text":"YUVIO"}]}]}
```
Run `npx editly --help`, then `npx editly demo.json --fast` for a draft. Omit --fast for delivery. Verify output with ffprobe and inspect frames before reporting success.

For the user's Video repository, keep source/specs in GitHub and render outputs in GitHub Actions artifacts or Releases when available. Never commit node_modules, credentials or caches. A local skill and temporary dependencies are distinct from long-term media storage. User authorization to create a video does not authorize publishing messages or public feedback.
