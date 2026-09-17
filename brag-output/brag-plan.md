# Brag Plan: MUNify CHASE

## Planning rubric (Step 1 answers)

1. **What is the app?** A free, open-source web app for running Model United Nations debates — speakers' lists, digital voting, roll call and collaborative resolution editing — built by volunteers at Deutsche Model United Nations (DMUN) e.V.
2. **Funniest / most impressive claim?** The confirm dialog in `messages/en.json`: **"Adopt this resolution? Confetti will celebrate the adoption!"** A piece of parliamentary-procedure software that warns you about confetti before you adopt a UN resolution. Runner-up, from the landing page: *"No more paper lists!"* and *"No more paper or Google Docs!"*
3. **Visual hook?** `ResultChart.svelte` — a stacked live vote bar (green pro / grey undecided / blue abstain / red con) with a hard neutral majority marker the green bar can cross. Plus the `CurrentSpeaker` block: a 4:3 flag card, the country in bold, and a mono countdown that turns red and prefixes `+` when the speaker runs over.
4. **What to show from the actual UI?** The chair's working screens, not the landing page: the General Speakers' List card, the `Majorities` stat row, the vote result bar, and the adopt-resolution modal → `AdoptionConfetti`.
5. **Shortest satisfying video?** ~23s. The confetti punchline needs the vote to land first, and the vote needs the majority marker established.
6. **Tone?** `polished`, with a warm final laugh. Direction: *an earnest civic-software product film that ends by admitting it has a confetti button.*
7. **Audio?** Steady, clean bed (vol-12) with restrained motion-matched SFX; one real payoff hit on the confetti. Subtle audio-reactive glow only.
8. **Share caption?** See "Share copy" below.
9. **User flow worth showing?** Yes — chair opens the speakers' list → runs a vote → adopts the resolution. Entry → key action → result, all real chair routes.

---

## What is this app?

MUNify CHASE is free, open-source software for running the debates at a Model United Nations conference — speakers' lists, timers, majorities, digital voting and resolution adoption — and it is genuinely delightful in a place software almost never is: the moment a resolution passes, it fires 30 seconds of confetti at the projector.

## The angle

Model UN simulates the most procedural institution on earth, and for decades it has been run on the least procedural tools available: handwritten speakers' lists, a stopwatch, and a shared Google Doc. CHASE replaces all of that with real software — and then, having built a rigorous parliamentary engine with majority thresholds and roll-call votes, it puts a confirm dialog in front of you that says *"Confetti will celebrate the adoption!"*

The video is straight-faced product film for four scenes, showing the actual chair UI doing actual chair work. The joke is not applied on top — it is quoted verbatim from the codebase in the final scene, and then paid off literally with the confetti the app really fires.

## Hook (first 2-3 seconds)

A paper speakers' list drops onto a dark navy field: ruled slip, handwritten country names, one crossed out, a stopwatch beside it. One serif line: **"Still running on paper."**

It earns the next 20 seconds because every person who has ever chaired a committee recognises that slip instantly.

## Key moments (the middle)

- **The countdown going over.** The current speaker's mono timer runs down to `0:00`, then flips: text turns `--color-error`, a `+` slides in from the left, and it starts counting *up* — `+0:03`. Straight out of `Timer.svelte`.
- **The majorities row computing itself.** Four mono stat cards land in sequence — present countries, simple majority, two-thirds majority, paper support threshold — the numbers the chair used to work out on a napkin.
- **The green bar crossing the line.** The vote result bar fills; the green pro segment grows and crosses the neutral majority marker. This is the climax of the product and it needs no caption.

## Outro / punchline

The adopt-resolution modal slides up carrying its real copy — *"Adopt this resolution? Confetti will celebrate the adoption!"* — a cursor clicks **Adopt Resolution**, and the app does exactly what it promised: full-screen confetti plus the `bg-primary` BREAKING marquee sliding up from the bottom. Logo, then *"Free and open-source software."*

## User flow worth showing

Three beats, all from the chair routes under `app/[conferenceId]/[committeeId]/(chairs)/`:

1. **Entry** — `speakers-list/` : the General Speakers' List card, current speaker with flag and timer, queue behind.
2. **Key action** — `voting/` : majorities row, then the live result chart filling toward the majority marker.
3. **Result** — the adopt confirmation → `AdoptionConfetti.svelte` firing on the presentation view.

## Tone

- **Preset:** `polished`
- **Creative direction:** an earnest civic-software product film that ends by admitting it has a confetti button
- **Interpretation:** Restraint for four scenes — one idea per scene, generous holds, slow crossfades, no bullet lists, no captions on the vote scene because the UI says it better. The energy is allowed to break exactly once, on the confetti, and that release is the whole payoff. Five scenes rather than the preset's 3-4, because the product has three real flow beats worth showing; scene *lengths* stay in polished range (3.8-5.5s).

## Format: landscape — 1920x1080
## Duration: 23.5s

## Visual identity (from the project)

Exact values from `@deutschemodelunitednations/corporate-identity` (`dmun-tailwind-shades.css` + `dmun-daisyUI-dmun-dark.css`). **Dark theme** — it is the more cinematic of the two shipped themes and the presentation/projector view is where the confetti lives.

- **Background (`base-100`):** `#0c192a`
- **Surface (`base-200`):** `#183254`
- **Surface raised (`base-300`):** `#254b7e`
- **Primary / brand (CHASE blue):** `#3D7DD2`
- **Text (`base-content` / `primary-50`):** `#ecf2fb`
- **Accent (gold):** `#D0AF65`
- **Success (pro):** `#29713c` bar, `#45BC64` for the crossing highlight
- **Error (con / overtime):** `#931128` bar, `#F51D42` for the overtime timer text
- **Info (abstain):** `#354657`
- **Neutral (majority marker):** `#ecf2fb`
- **Display font:** Vollkorn (serif — the landing `h1` is `font-serif`)
- **Body font:** Outfit (sans)
- **Mono font:** Roboto Mono (timer, majority numbers, vote counts)
- **Radius:** `0.5rem` on every card, field and selector (`--radius-box/field/selector`)
- **Strongest visual element:** the `ResultChart` stacked bar with its neutral majority marker badge
- **Logo:** `src/assets/logo/svg/chase_logo_white_text.svg` (globe mark + CHASE wordmark, used as-is); brand blue `#3d7dd2`, navy `#1e3050`

## Share copy (draft)

Model UN has been run on paper speakers' lists and shared Google Docs for about as long as Model UN has existed. We built MUNify CHASE to fix that — speakers' lists, timers, majorities and digital voting, free and open source. And yes, the adopt-resolution dialog warns you about the confetti. 🎉

## Audio direction

- **Role:** Steady, clean bed with sparse motion-matched accents; one genuine payoff hit.
- **Music:** `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (117.4s, ~110 BPM, "steady and clean" — the preset's `polished`/`cinematic` pick).
- **Music treatment:** Start at 0, volume ~0.32. Slight duck (~0.24) under the modal hold in Scene 5 so the confirm copy reads in near-quiet, back to full on the confetti. Fade out over the last ~1.0s under the logo.
- **Music cue guidance:** Preset cue file read (`cues/happy-beats-business-moves-vol-12-...music-cues.json`), tempo 109.96 BPM.
  - **Strong-cue locks (3):** `8.74s` (0.99) — speakers'-list card lands; `17.47s` (0.99) — green bar crosses the majority marker; `22.93s` (1.00) — confetti + marquee + logo. A fourth soft lock at `13.11s` (0.98) for the cut into the vote scene.
  - **Beat-grid windows:** majorities stat cards across `13.11 / 13.64 / 14.20 / 14.73` (numerals, so full-beat spacing is fine and they hold on screen afterwards); speakers'-queue rows on *every other* beat `9.83 / 10.93 / 12.02` because those are readable country names.
- **Audio-reactive treatment:** subtle; let music RMS drive a gentle glow on the CHASE blue elements (logo mark, primary button, marquee bar) and a slight depth breath on the background vignette. No waveform, equalizer, particles or text scaling.
- **SFX posture:** sparse for scenes 1-4 (polished restraint, 0.55-0.7 volume), one real hit on the confetti. Coherent palette: wood/soft impacts for physical objects, card sounds for card-like UI landing, one mouse click for the simulated cursor, one bell for the payoff.
- **Audio-coupled moments:** paper slip landing (Scene 1); logo mark settling (Scene 2); speakers'-list card landing + queue rows arriving (Scene 3); majorities cards landing one by one, green bar crossing the marker (Scene 4); cursor click on Adopt, confetti burst (Scene 5).
- **Restraint rule:** No sound on the overtime flip louder than a whisper — the red is the event, not a buzzer. No SFX at all during the modal hold; the confirm sentence must be read in quiet. Nothing comedic, cartoonish or "error"-flavoured anywhere: this is a real tool used by real conferences, and the humour is in the quoted copy, not in the sound design.

---

## Storyboard

Absolute timeline. Total **23.5s**.

### Scene 1 — Still running on paper — 0 → 3.82s (3.82s)

Dark navy `#0c192a` field, soft vignette. At `0.56` (beat) a ruled paper slip drops in slightly rotated (~-3°), with a hand-written speakers' list: `1. Deutschland` (struck through), `2. France`, `3. Brasil`, `4. Nigeria`, and a small drawn stopwatch in the corner. At `1.09` the serif line settles beneath it in Vollkorn `#ecf2fb`: **"Still running on paper."** — holds 2.7s.

Sequential/interaction: none — the slip lands as one object.
Audio intent: quiet, slightly wistful; establish the bed without energy.
Audio-coupled idea: one soft `impactWood_light_*` at the paper's first visible frame (~0.5s).
Music: steady bed, in from 0 at ~0.32.
Transition mood: soft → Scene 2 (paper slides out left, crossfade 0.6s)

### Scene 2 — Reveal — 3.82 → 8.74s (4.92s)

Paper exits left at `3.82`. At `4.39` (beat) the CHASE gavel mark scales in at centre in brand blue `#3D7DD2`. At `4.91` (beat) the wordmark **MUNify CHASE** settles beside/below it in Outfit. At `6.00` (beat) the hero line arrives in Vollkorn at full scale, verbatim from `homeCaption`, with **MUN** in the brand-blue gradient the landing page uses:

> **MUN** in the 21st century.

Holds 2.7s to the cut.

Sequential/interaction: mark → wordmark → headline, three settled arrivals, not a rapid stagger.
Audio intent: the bed opens up; the product arrives with quiet confidence.
Audio-coupled idea: one `impactSoft_medium_*` at the mark's scale-in (~4.3s). Nothing on the wordmark or headline.
Music: unchanged.
Transition mood: clean cut on the strong cue → Scene 3 // beat-locked: 8.74s

### Scene 3 — The speakers' list — 8.74 → 13.11s (4.37s)

// beat-locked: 8.74s

The chair's **General Speakers' List** card lands at `8.74` (strong cue, 0.99) — `base-200` `#183254` surface, `0.5rem` radius, card title in Outfit. At `9.29` (strong cue) the `CurrentSpeaker` block fills it: a 4:3 flag card (Germany, rounded, shadow) beside **Deutschland** in bold 2xl, and below it the hourglass + mono timer reading `0:14 / 3:00`.

The timer runs. Queue rows arrive behind it on every *other* beat — `9.83` `2. France`, `10.93` `3. Brasil`, `12.02` `4. Nigeria` — each a small flag chip, a dimmed index number and a bold country name, matching `ChairSpeakersQueue.svelte`.

At `11.46` one line settles top-left, verbatim from the landing page's speakers'-list card: **"No more paper lists."** — holds 1.65s.

At `12.55` the timer crosses zero: the whole block transitions to `#F51D42` over ~0.4s, a `+` slides in from `-translate-x-3` to `0`, and the clock starts counting **up** — `+0:03`.

Sequential/interaction: yes — 3 queue rows arrive one by one on the beat grid (`// beat-grid: 9.83 / 10.93 / 12.02`), each held on screen through the end of the scene.
Audio intent: the product working; procedural, calm, competent.
Audio-coupled idea: `casino/card-place-*` on the list card landing (8.7s); a softer `interface/drop_*` per queue row, or accent only the first and last if three feels busy; the overtime flip gets at most a near-inaudible `ui/switch*` — or nothing.
Music: unchanged.
Transition mood: clean cut → Scene 4 // beat-locked: 13.11s

### Scene 4 — The vote — 13.11 → 18.56s (5.45s)

// beat-locked: 13.11s

**No caption in this scene.** The UI carries it.

The `Majorities` row lands card by card on consecutive beats — `13.11`, `13.64`, `14.20`, `14.73` (`// beat-grid`) — four `base-200` cards, each a duotone icon over a mono 3xl number: **193** (present), **97** (simple majority), **129** (two-thirds), **20** (paper support threshold).

At `15.29` the result bar appears below them: a full-width `base-300` track at `0.5rem` radius with the neutral majority marker bar and its `97` badge sitting at the simple-majority position.

From `15.84` the segments grow with the real component's 300ms-feel easing: green `#29713c` pro from the left, blue-grey `#354657` abstain and red `#931128` con from the right, each with its count badge. The green segment reaches and crosses the neutral marker at **`17.47`** (strong cue, 0.99) — brief lift to `#45BC64` and a soft glow on the crossing. Final counts land: pro **118**, abstain **41**, con **34**.

Sequential/interaction: yes — 4 stat cards one by one on the beat grid; then the bar fills as one continuous growth.
Audio intent: accumulating, then a single clean moment of arrival. No triumph yet — that is Scene 5's job.
Audio-coupled idea: `casino/chip-lay-*` per stat card (or first + last only); one restrained `impact/impactSoft_medium_*` exactly at the crossing (17.47s).
Music: unchanged.
Transition mood: clean cut → Scene 5 // beat-locked: 18.56s

### Scene 5 — Confetti will celebrate the adoption — 18.56 → 23.5s (4.94s)

// beat-locked: 18.56s

The screen dims and a modal slides up at `18.56` — `base-100` card, `0.5rem` radius, shadow. Title in Outfit: **Adopt Resolution**. Body, verbatim from `messages/en.json`:

> **Adopt this resolution? Confetti will celebrate the adoption!**

Two buttons: a ghost **Cancel** and a primary `#3D7DD2` **Adopt Resolution**. The sentence holds in near-silence (music ducked to ~0.24) from ~19.0 to 21.8 — **2.8s settled**, above the 8-word floor.

At `21.84` (beat) a cursor arrives and clicks **Adopt Resolution**; the button depresses. At `22.0` the modal dismisses.

At **`22.37`** (strong cue, 0.98) the confetti fires — full-screen, falling, exactly what `AdoptionConfetti.svelte` does — and the `bg-primary` `#3D7DD2` marquee bar slides up from the bottom carrying the real announcement string in `primary-content`:

> **BREAKING: Resolution on "Climate Finance" adopted in the committee General Assembly  +++**

At **`22.93`** (strong cue, 1.00) the CHASE logo + wordmark settle over the celebration in white, marquee still scrolling beneath. At `23.2` one small closing line in Outfit: **"Free and open-source software."** Music fades out over the final ~1.0s; confetti continues to the last frame.

Sequential/interaction: yes — a simulated cursor click on the primary button is the trigger for the entire payoff.
Audio intent: hold the breath during the modal, then release completely. This is the only loud moment in the video and it should feel earned.
Audio-coupled idea: `ui/mouseclick1` at 21.84 exactly on the button depress; `impact/impactBell_heavy_000` at 22.37 on the confetti burst, optionally layered with `casino/chips-collide-*`; nothing after — let the bell ring over the fading bed.
Music: ducked ~0.24 for the modal hold, back to ~0.32 at 22.37, fade to 0 across the last second.
Transition mood: hard release → end.

---

**Music mood for this video:** steady and clean, restrained for four scenes, one genuine release on the confetti.

**Audio summary:** A calm, procedural bed carries four scenes of real chair software doing real work with only whisper-level motion accents; the music ducks almost to silence so the confetti line can be read, then opens back up on a single bell as the app does literally what its confirm dialog promised.
