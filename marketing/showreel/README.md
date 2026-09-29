# QuintByte showreel

A 20-second, 1080p60 motion-graphics reel, rendered entirely from code: a canvas renderer
written from scratch, a synthesized score, and ffmpeg. No templates, footage or samples.
Every frame is a pure function of time, so frames render in parallel and any moment can be
previewed instantly.

## Chapters (120 BPM — cuts land on the beat)

| Time      | Chapter                  | Techniques                                                   |
| --------- | ------------------------ | ------------------------------------------------------------ |
| 0–2 s     | 01 Ignite                | HUD scanner, 1,400-particle vortex, detonation               |
| 2–4 s     | 02 Moving parts          | Kinetic type, motion-blur ghosts, spring physics, explosion  |
| 4–7 s     | 03 The work behind       | Stateless bounce physics, parallax marquees, time-freeze DOF |
| 7–11 s    | 04 One partner           | Shockwave, orbit swirl with trails, 3-D projection tilt      |
| 11–14.5 s | 05 The right specialists | Match-cut into isometric stack, gravity drops, impact FX     |
| 14.5–17 s | 06 Clear accountability  | Whip-pan smear, tracking camera, slot-roll type, pull-back   |
| 17–20 s   | 07 QuintByte             | Particles-to-logo, path draw-on, bloom burst, mask wipe      |

Post: bloom, radial chromatic aberration, camera shake, directional smear, grain, vignette.
All copy comes from the website / BMS document; the logo, icons and fonts are the site's own.

## Commands

```bash
npm install
npm run fonts                        # once: brand TTFs (OFL) into assets/fonts
node src/preview.mjs 3.6 9.5 19.9    # contact sheet → out/preview.png
node src/preview.mjs --full 12.4     # one full-res frame
npm run render                       # score + parallel render + mux → out/
```

Outputs in `out/` (git-ignored):

- `QuintByte-Showreel-1080p60.mp4` — master (H.264 CRF 14, AAC 256k, −14 LUFS)
- `QuintByte-Showreel-web.mp4` — web version (CRF 22, capped 9 Mbps) — make it with the
  ffmpeg line below after a render
- `QuintByte-Showreel-poster.png` — end-card frame for `<video poster>` / thumbnails

```bash
ffmpeg -i out/QuintByte-Showreel-1080p60.mp4 -c:v libx264 -preset slow -crf 22 -maxrate 9M -bufsize 18M -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out/QuintByte-Showreel-web.mp4
```

## Layout

```
src/
  timing.mjs          clock, BPM, impact list (drives shake, flashes, aberration AND the score)
  frame.mjs           compositor: scenes → post FX → HUD → grade
  scenes/             one file per chapter + stage geometry shared by 04/05
  core/               math & easing, brand assets (read from the website), drawing, FX, captions, HUD
  audio.mjs           the synthesized score → out/audio.wav
  render.mjs          parallel render + concat + two-pass loudnorm mux
  render-worker.mjs   renders a frame range into its own x264 encoder
```
