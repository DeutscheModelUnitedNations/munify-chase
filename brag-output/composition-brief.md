# Hyperframes Composition Brief: MUNify CHASE

## Objective

Create a short launch-style brag video for MUNify CHASE — the free, open-source debate-management app for Model United Nations conferences built by DMUN e.V.

## Output

- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 23.5 seconds

## Source Material

- Project root: `/Users/tadestrehk/Developer/DMUN/chase`
- Primary files read:
  - `messages/en.json` (all copy below is verbatim from here)
  - `src/routes/(pages)/LandingHero.svelte` (hero headline treatment)
  - `src/routes/app/[conferenceId]/[committeeId]/(chairs)/speakers-list/+page.svelte`
  - `src/lib/components/speakersList/CurrentSpeaker.svelte`, `Timer.svelte`
  - `src/lib/components/speakersList/ChairSpeakersQueue.svelte`
  - `src/lib/components/Majorities.svelte`
  - `src/lib/components/voting/ResultChart.svelte`
  - `src/lib/components/AdoptionConfetti.svelte`
  - `src/lib/components/Flag.svelte`
  - `@deutschemodelunitednations/corporate-identity` → `dmun-tailwind-shades.css`, `dmun-daisyUI-dmun-dark.css`, `dmun-fonts.css`
- Product name: **MUNify CHASE** (CHASE = CHAiring SoftwarE)
- Tagline / strongest claim: *"Adopt this resolution? Confetti will celebrate the adoption!"*
- Key UI moments to recreate (in order of importance):
  1. `ResultChart` — stacked live vote bar with a neutral majority marker the green segment crosses
  2. `CurrentSpeaker` + `Timer` — flag card, country name, mono countdown that turns red and prefixes `+` on overtime
  3. `Majorities` — row of four `base-200` cards, duotone icon over a mono 3xl number
  4. The adopt-resolution modal → `AdoptionConfetti` (confetti + `bg-primary` BREAKING marquee)

### Copy that must appear verbatim

- `Still running on paper.` *(written for the hook — the only non-source line in the video)*
- `MUN in the 21st century.` — `homeCaption`, with **MUN** in the brand-blue gradient
- `No more paper lists.` — from `homeHeroCardSpeakersListText`
- `Adopt this resolution? Confetti will celebrate the adoption!` — `confirmAdoptResolution`
- `Adopt Resolution` / `Cancel` — `adoptResolution`
- `BREAKING: Resolution on "Climate Finance" adopted in the committee General Assembly` — `adoptionAnnouncement` with its placeholders filled
- `General Speakers' List` — `speakersList`
- `Free and open-source software.` — from `homeAboutText`

Do not paraphrase these. They are the product's own voice and the reason the video is specific to this project.

## Creative Direction

- **Tone preset:** `polished`
- **Creative direction:** an earnest civic-software product film that ends by admitting it has a confetti button
- **Interpretation:** Restraint for four scenes — one idea per scene, generous holds, slow crossfades, no bullet lists. Scene 4 (the vote) carries **no caption at all**; the UI is more articulate than any line would be. The energy breaks exactly once, on the confetti, and that release is the payoff. Five scenes rather than the preset's 3-4 because the product has three real flow beats; scene lengths stay in polished range (3.8-5.5s).
- **Angle:** Model UN simulates the most procedural institution on earth and has been run on the least procedural tools available — handwritten speakers' lists, a stopwatch, a shared Google Doc. CHASE replaces that with real software, and then, having built a rigorous parliamentary engine with majority thresholds and roll-call votes, puts a confirm dialog in front of you that warns you about confetti. The joke is not applied on top; it is quoted from the codebase and then paid off literally with the confetti the app really fires.
- **Hook:** A ruled paper speakers' list drops onto dark navy — handwritten country names, one struck through, a small stopwatch — under the line *"Still running on paper."*
- **Outro / punchline:** The real confirm dialog → cursor clicks Adopt → confetti + BREAKING marquee → logo → *"Free and open-source software."*
- **Avoid:**
  - Generic SaaS language ("streamline", "supercharge", "workflow")
  - Abstract filler visuals, particle fields, gradient washes
  - Unrelated visual redesign — this is the DMUN dark theme, exactly
  - Mocking the product. It is a volunteer-built non-profit tool; the humour is warm and comes from its own copy
  - UN/flag clichés beyond the flags the app itself renders

## Visual Identity

Dark theme (`dmun-dark`) — the more cinematic of the two shipped themes, and the presentation/projector view is where the confetti actually lives. Exact values:

- **Background (`base-100`):** `#0c192a`
- **Surface (`base-200`):** `#183254`
- **Surface raised (`base-300`):** `#254b7e`
- **Primary / brand (CHASE blue):** `#3D7DD2`
- **Text (`base-content`):** `#ecf2fb`
- **Accent (gold):** `#D0AF65`
- **Success (pro bar):** `#29713c`, crossing highlight `#45BC64`
- **Error (con bar / overtime text):** `#931128` bar, `#F51D42` text
- **Info (abstain bar):** `#354657`
- **Neutral (majority marker + badge):** `#ecf2fb` on `#0c192a` text
- **Display font:** Vollkorn (serif) — Google Fonts / `@fontsource/vollkorn`
- **Body font:** Outfit (sans) — Google Fonts / `@fontsource/outfit`
- **Mono font:** Roboto Mono — timers, majority numbers, vote counts
- **Radius:** `0.5rem` on every card, field, button and selector (`--radius-box/field/selector`)
- Prefer local font files if the project or a local package provides them; otherwise embed the three families so the render never falls back.

**Visual references from the project:**

- Cards: `base-200` surface, `0.5rem` radius, soft shadow, title in Outfit above the content
- Flag: a 4:3 rounded card with a shadow (see `Flag.svelte` sizing — `lg` is `8rem × 6rem`); simple stripe flags (Germany, France, Brasil, Nigeria) can be drawn in CSS
- Speakers' queue row: dimmed index `2.`, small flag chip, bold country name, 1px `base-100` border, `0.5rem` radius
- Timer: mono, the `+` sits at `-translate-x-3` and slides to `0` when overtime begins; colour transition ~1s in the real component, tighten to ~0.4s for video
- Vote bar: full-width `base-300` track, segments growing with ~300ms easing, count badges pinned to each segment, a 2-unit-wide neutral marker bar with a `97` badge above it
- Logo: `src/assets/logo/svg/chase_logo_white_text.svg` (globe mark + CHASE wordmark, white version for dark backgrounds). Brand blue `#3d7dd2`, navy `#1e3050`. Copy the SVG into `composition/assets/` and reference it relatively.

## Storyboard

Use the storyboard in `brag-output/brag-plan.md` as the creative contract. Scene summary (absolute timeline, total 23.5s):

1. **Still running on paper** — 0 → 3.82s (3.82s) — paper slip with a handwritten speakers' list lands; serif line *"Still running on paper."* holds 2.7s.
2. **Reveal** — 3.82 → 8.74s (4.92s) — gavel mark scales in at 4.39, wordmark at 4.91, hero line *"**MUN** in the 21st century."* at 6.00 holding 2.7s.
3. **The speakers' list** — 8.74 → 13.11s (4.37s) — General Speakers' List card lands on the strong cue; current speaker **Deutschland** with flag and mono timer `0:14 / 3:00`; three queue rows arrive on every other beat; *"No more paper lists."* at 11.46; timer crosses zero at 12.55 → red, `+` slides in, counts up to `+0:03`.
4. **The vote** — 13.11 → 18.56s (5.45s) — **no caption**; four majority stat cards land on consecutive beats (193 / 97 / 129 / 20); result bar appears at 15.29; segments grow from 15.84; green crosses the neutral majority marker at 17.47; final counts pro 118 / abstain 41 / con 34.
5. **Confetti will celebrate the adoption** — 18.56 → 23.5s (4.94s) — modal slides up with the verbatim confirm copy, holds 2.8s in near-silence; cursor clicks **Adopt Resolution** at 21.84; confetti + BREAKING marquee at 22.37; logo at 22.93; *"Free and open-source software."* at 23.2; music fades out.

## Audio

- **Audio role:** sparse professional accents over a steady bed, with one genuine release on the confetti.
- **Audio arc:** Calm and procedural for four scenes with only whisper-level motion accents → music ducks almost to silence so the confirm sentence reads → full release on the confetti with a single bell → fade out under the logo.
- **Music:** `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (117.4s, ~109.96 BPM, "steady and clean" — the preset's `polished` pick).
- **Music treatment:** Start at 0, volume ~0.32. Duck to ~0.24 across the modal hold (≈18.9 → 22.3) so the confetti line is read in near-quiet, back to ~0.32 at 22.37, fade to 0 across the final ~1.0s. Let the payoff bell ring over the fading bed.
- **Music cue guidance:** Bundled preset — `composition/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (copied alongside the track). Tempo 109.96 BPM.
  - **Strong-cue locks (3 primary + 1 soft):** `8.74s` (0.99) speakers'-list card lands; `17.47s` (0.99) green bar crosses the majority marker; `22.93s` (1.00) logo settles over the confetti. Soft lock at `13.11s` (0.98) for the cut into the vote scene. Confetti burst at `22.37s` (0.98).
  - **Beat-grid windows:** majority stat cards at `13.11 / 13.64 / 14.20 / 14.73` — numerals, so full-beat spacing is fine and each holds on screen afterwards. Speakers'-queue rows at `9.83 / 10.93 / 12.02` — **every other beat**, because these are readable country names and 0.545s spacing would outrun reading.
- **Audio-reactive treatment:** subtle. Use music RMS/bass to breathe a gentle glow on the CHASE-blue elements (gavel mark, primary button, marquee bar) and a slight depth swell on the background vignette. No waveform, equalizer, musical notes, particle systems, strobing or text scaling.
- **Audio-coupled moments:**
  - Scene 1, ~0.5s — paper slip landing — one soft wood/physical impact
  - Scene 2, ~4.3s — gavel mark scaling in — one soft reveal impact; nothing on wordmark or headline
  - Scene 3, 8.7s — speakers'-list card landing — card-place sound
  - Scene 3, 9.83 / 10.93 / 12.02 — queue rows arriving — soft drops, or accent first and last only if three feels busy
  - Scene 3, 12.55s — overtime flip — at most a near-inaudible switch, or nothing at all
  - Scene 4, 13.11-14.73 — four stat cards landing — chip-lay per card, or first and last only
  - Scene 4, 17.47s — green crossing the majority marker — one restrained soft impact
  - Scene 5, 21.84s — cursor clicking Adopt Resolution — mouse click, exactly on the button depress
  - Scene 5, 22.37s — confetti burst — heavy bell, optionally layered with chips-collide
- **SFX selection guidance:** Keep one coherent palette — wood/soft impacts for physical objects, card sounds for card-like UI landing, one mouse click for the simulated cursor, one bell for the payoff. Volume 0.55-0.7 for scenes 1-4; the payoff may go higher. **No SFX at all during the modal hold** (≈18.9 → 21.8) — the confirm sentence must be read in quiet. Nothing comedic, cartoonish, glitchy or error-flavoured anywhere: this is a real tool used by real conferences, and the humour is in the quoted copy, not the sound design. The overtime flip is an event marked by colour, not by a buzzer.
- **SFX analysis guidance:** `/Users/tadestrehk/.claude/plugins/cache/brag/brag/0.2.2/skills/brag/assets/sfx/sfx-analysis.md` (and `.json`). Prefer low/medium high-frequency-risk files throughout — this is a polished tone with repeated sequential cues.
- **Exact SFX choice:** Hyperframes chooses filenames, timestamps, density and volume based on the implemented animation.
- **Audio files:** music and its cue JSON are already copied into `brag-output/composition/assets/music/`. Copy any selected SFX into `brag-output/composition/assets/sfx/<family>/` and reference everything with paths relative to `composition/` — never absolute paths.

## Voiceover

**Disabled.** `--voice` was not passed. Do not write a narration script, generate speech, duck music for a voice track, or add a voice track of any kind.

## Hyperframes Instructions

Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract + `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes` (seek-safe keyframes), and `hyperframes-cli` (lint/check/render). `/brag` is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:

- Show real UI from the source project — at minimum the vote result bar, the current-speaker block and the adopt modal, all recreated faithfully from the components listed above.
- Keep all text readable. Every line a viewer must read holds long enough: short labels ~0.8s settled, sentences ~0.3s per word. The confirm sentence (8 words) gets 2.8s.
- Keep the video at 23.5s (within the 15-25s band).
- Include the music and SFX layer as specified.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Ignore any cue that hurts readability, scene pacing or the product story. Use the 3 primary strong-cue locks; do not force every tween onto a beat.
- Honour the music ducking under the modal and the fade-out under the logo.
- Wire at least one visual element to per-frame audio data (see audio-reactive treatment above). If extraction is unavailable (no helper or ffmpeg missing), note it and skip — do not block the render.
- Use local assets for audio, fonts, the logo and any runtime dependencies.
- Run `hyperframes check` before render — it is brag's single gate.
