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

## Current state
- Phases 1–5 done: scaffolded Next.js app, built the Kerala scene (background, top bar with a
  real Kerala-time clock + real presence counter, Malayalam title, glassmorphic player island),
  wired the player to a real `<audio>` element (play/pause/prev/next/scrub), and polished sizing/
  position per feedback. Verified visually in browser preview.
- Presence counter is real but needs an Upstash Redis database + env vars set on Vercel to count
  across visitors in production (see README). Without it, every deploy still shows "1" safely.
- Phase 4 (your music) not started — `public/audio/` is empty, `src/lib/scenes.ts` has one
  placeholder track with no `file` path (play button is disabled until a real file is added).
- Background image lives at `public/scenes/kerala-scene.png` (PNG, not yet converted to WebP).
- Pushed to GitHub (`main`), not yet deployed to Vercel (user will deploy themselves).
