# Kerala Radio

## Done means
A deployable Next.js site showing a Kerala ambient scene (background art, live Kerala-time clock,
glassmorphic music player) that plays the user's own uploaded MP3s, structured so more scenes can
be added later without a rewrite. Center title is in Hindi/Devanagari (`केरल`).

## Anti-goals (v1)
- No multi-scene switcher UI (data structure supports it, but only one scene ships)
- No auth or user accounts
- No perfected mobile layout (desktop-first; must not be broken on mobile, but not polished)

## Stack
- **Next.js 16 (App Router) + TypeScript** — file-based routing, easy Vercel deploy, room to grow to multi-scene later
- **Tailwind CSS** — utility classes for the token system (spacing/radius/blur scale)
- **Audio**: served statically from `/public/audio`, playlist hardcoded in `src/lib/scenes.ts`
- **Presence**: one serverless API route (`src/app/api/presence/route.ts`) backed by Upstash Redis
  (REST-based, works on Vercel serverless — no persistent server needed). Falls back to reporting
  "1" if `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` / `_TOKEN`) aren't set,
  so local dev and a not-yet-configured deploy never break.
- **Vercel** — user deploys manually, not part of this repo's automation

## Decisions log
- 2026-08-09 — Scaffolded with `create-next-app` (TS, Tailwind, App Router, src dir). Reason: fastest path to a Vercel-ready skeleton.
- 2026-08-09 — Clock shows fixed `Asia/Kolkata` time regardless of viewer location (per user confirmation). Reason: ambient/lofi-radio scenes have their own "local" time, matches reference vibe.
- 2026-08-09 — Center title text is `കേരളം` ("Kerala" in Malayalam, per user confirmation).
- 2026-08-09 — Background image kept as PNG in `public/scenes/kerala-scene.png` for now; WebP conversion deferred to polish phase (not blocking).
- 2026-08-09 — Real presence counter added (was decorative in v1 draft, promoted to a real feature
  per user request). Reason: user wants it to reflect actual concurrent visitors, not a fake number.
  Implemented with Upstash Redis via a serverless API route rather than WebSockets, since Vercel
  serverless can't hold long-lived socket connections — a REST-based heartbeat (10s interval,
  25s staleness window) fits the platform and needs no separate server process.
- 2026-08-09 — Removed Spotify/YT Music links from the top bar per user request (dead placeholder
  links weren't adding value). `spotifyUrl`/`ytMusicUrl` stay in the `Scene` type for future reuse
  but are no longer rendered.
- 2026-08-09 — Clock enlarged and switched to Space Grotesk (bolder/blockier than Geist) with a
  small "🌴 KL TIME" label underneath, clarifying the clock is Kerala local time, not the viewer's.
- 2026-08-09 — Player island enlarged and shifted up (bottom-20 vs bottom-8, bigger padding/art/
  controls) per user request — original sizing read as too small against the reference.
- 2026-08-09 — Online counter moved from top-center to directly under the clock ("KL TIME · N
  online"), a live-pulsing dot added beside the time, and the palm emoji dropped from the KL TIME
  label — all per user feedback on the top bar layout.
- 2026-08-09 — Considered switching to a Spotify playlist as the audio source instead of local
  MP3s; user backed out and confirmed sticking with local downloads. No code changes made — noted
  here so a future session doesn't re-litigate it from scratch.
- 2026-08-09 — Center title switched from Malayalam (`കേരളം`) to Hindi/Devanagari (`केरल`) per
  explicit user confirmation, reversing the earlier "not Hindi — Kerala's regional language"
  decision from the original handoff spec. Font switched from Baloo Chettan 2 (rounded, Malayalam
  subset) to Yatra One (bold decorative Devanagari display font, closer to the original reference
  screenshot's look). `--font-malayalam` CSS var/token renamed to `--font-title` since it's no
  longer script-specific.
- 2026-08-09 — Title wording changed again to "केरल के खेत" ("Fields of Kerala") per user request,
  after briefly trying the English phrase "Kerala Fields" in the same font. Same Yatra One font
  kept throughout — only the text content changed.
- 2026-08-09 — Phase 4 done: 10 real MP3s added to `public/audio/` (user's own downloads, sourced
  from `~/Documents/kerala-radio/Songs/`), `src/lib/scenes.ts` populated with matching track
  metadata. Files had no ID3 tags, so title/artist were derived from filenames — a few tracks
  (Drizzle, Nilaya, Sudhar, Gravity, Krishna's Dance, I Wanted to Leave) have no discoverable
  artist and are labeled "Unknown Artist"; correct these in `scenes.ts` if the real artist is known.
  No per-track album art was supplied, so all tracks reuse `kerala-scene.png` as the vinyl label —
  swap `albumArt` per track later if real covers become available.
- 2026-08-09 — Replaced the square album-art `<img>` in the player island with a spinning vinyl
  record (CSS `repeating-radial-gradient` for grooves + a small circular label crop of the album
  art + a spindle-hole dot), per user request. Spin driven by a CSS `vinyl-spin` keyframe class
  toggled with `animation-play-state` (running/paused) rather than adding/removing the animation,
  so pausing holds the current rotation angle instead of snapping back to 0deg.
- 2026-08-09 — Fixed a real bug while testing playback: `onLoadedMetadata` can fire before React
  finishes attaching its listener when a file loads fast (e.g. from browser cache), silently
  leaving `duration` stuck at 0 forever even though audio plays fine. Fixed by also syncing
  `duration` inside the `onTimeUpdate` handler (fires repeatedly during playback, so it's a
  reliable fallback) rather than relying on `onLoadedMetadata` alone.
- 2026-08-09 — `isPlaying` state is now driven solely by the `<audio>` element's native
  `onPlay`/`onPause` events instead of being optimistically toggled in the click handler —
  keeps the UI (including vinyl spin) truthful if `audio.play()` is rejected (e.g. autoplay
  policy) instead of showing "playing" when it isn't.

## Current state
- Phases 1–5 done, phase 4 (your music) done: scaffolded Next.js app, built the Kerala scene
  (background, top bar with a real Kerala-time clock + real presence counter, Hindi title,
  glassmorphic player island with a spinning vinyl record), wired the player to a real `<audio>`
  element (play/pause/prev/next/scrub, duration bug fixed), and loaded in the user's 10 real songs.
  Verified end-to-end in browser preview: playback, progress, duration, and vinyl spin all confirmed
  working.
- Presence counter is real but needs an Upstash Redis database + env vars set on Vercel to count
  across visitors in production (see README). Without it, every deploy still shows "1" safely.
- Some tracks are missing real artist credit (see decisions log) and none have dedicated album
  art yet — cosmetic gaps only, playback works for all 10.
- Background image lives at `public/scenes/kerala-scene.png` (PNG, not yet converted to WebP).
- Pushed to GitHub (`main`) through the title-wording commit; the song-library + vinyl-spin work
  in this session is queued to commit next. Not yet deployed to Vercel (user will deploy themselves).
