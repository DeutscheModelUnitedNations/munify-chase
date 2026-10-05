# Landing page feature video

Builds the 49 second video embedded on the landing page (`src/routes/(pages)/VideoSection.svelte`) from real CHASE screens.

```bash
bun run video:build     # capture + render
bun run video:capture   # screens and anchors only
bun run video:render    # video from the last capture
bun run video:render --stills 3,9.5,26   # a few frames to .out/stills/ for checking
```

Output: `static/video/chase-feature.{webm,mp4,jpg}`. Commit those three files. Everything else lands in `.out/` (git-ignored).

## Requirements

- The dev Postgres container running (`bun run dev:docker`). Capture uses its own `chase_docs` database, like `bun run docs:screenshots`, and never touches your dev data.
- Your own dev server stopped. Capture starts one and needs ports 5173 and 8090.
- `ffmpeg` with libx264, libvpx-vp9 and libopus.

## How it works

| File | Role |
| --- | --- |
| `capture.ts` | Captures the screens at 80% browser zoom and writes `anchors.json`: where the buttons, menu items and phase steps the video points at sit in each capture |
| `composition.html` | The video as a web page. `renderAt(t)` draws second `t`. Texts, timings, camera moves and the cursor live here |
| `audio.ts` | Synthesizes the soundtrack. It's deterministic, so it produces the same music every time |
| `render.ts` | Renders every frame, mixes in the audio, bakes the poster in as frame 0 and encodes the web files |

The docs screenshot pipeline (`scripts/docs-screenshots`) does the staging: `capture.ts` reuses its shots, staged conference and logins. The other pages (landing page, offline demo, manual) are captured directly.

## Changing things

- **The UI changed.** Run `bun run video:build`. Positions come from `anchors.json`, so nothing needs re-measuring, as long as the locators in `capture.ts` still find their elements. If a locator breaks, capture fails with the element's name.
- **Texts or timing.** Edit `composition.html`. Elements fade in at `data-in` and out at `data-out` (seconds). Each scene's camera, cursor and highlights sit in `renderAt` under the scene's comment. If you move a scene cut, click or bell, move the matching cue in `audio.ts` too.
- **Pointing at a new element.** Add a locator to the screen's `docsShot(...)` or page block in `capture.ts`. Then use it as `data-anchor="<capture>:<name>"` on an overlay, or as `anchor('<capture>', '<name>')` in `renderAt`.
- **Checking a change.** Render a few stills with `--stills` before doing a full render, which takes about two minutes.

## Notes

- Capture starts Vite with a larger stack (`ulimit -s` plus `node --stack-size`). Otherwise Vite's dependency pre-bundling of `@mlc-ai/web-llm` overflows Node's default stack on macOS, and every page that loads it returns a 500.
- These scripts are excluded from prettier, eslint, fallow and the typecheck. They are a local tool and never block CI.
