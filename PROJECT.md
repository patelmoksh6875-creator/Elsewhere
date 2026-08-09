# Kerala Radio

## Done means
A deployable Next.js site showing a Kerala ambient scene (background art, live Kerala-time clock,
glassmorphic music player) that plays the user's own uploaded MP3s, structured so more scenes can
be added later without a rewrite.

## Anti-goals (v1)
- No multi-scene switcher UI (data structure supports it, but only one scene ships)
- No real presence counter (decorative/lightly randomized number)
- No backend, auth, or database — fully static, client-side audio playback
- No perfected mobile layout (desktop-first; must not be broken on mobile, but not polished)

## Stack
- **Next.js 15 (App Router) + TypeScript** — file-based routing, easy Vercel deploy, room to grow to multi-scene later
- **Tailwind CSS** — utility classes for the token system (spacing/radius/blur scale)
- **No backend** — audio files served statically from `/public/audio`, playlist hardcoded in `src/lib/scenes.ts`
- **Vercel** — user deploys manually, not part of this repo's automation

## Decisions log
- 2026-08-09 — Scaffolded with `create-next-app` (TS, Tailwind, App Router, src dir). Reason: fastest path to a Vercel-ready skeleton.
- 2026-08-09 — Clock shows fixed `Asia/Kolkata` time regardless of viewer location (per user confirmation). Reason: ambient/lofi-radio scenes have their own "local" time, matches reference vibe.
- 2026-08-09 — Center title text is `കേരളം` ("Kerala" in Malayalam, per user confirmation).
- 2026-08-09 — Background image kept as PNG in `public/scenes/kerala-scene.png` for now; WebP conversion deferred to polish phase (not blocking).

## Current state
- Phases 1–3 done: scaffolded Next.js app, built the Kerala scene (background, top bar with
  Kerala-time clock + fake presence counter + Spotify/YT links, Malayalam title, glassmorphic
  player island), and wired the player to a real `<audio>` element (play/pause/prev/next/scrub).
  Verified visually in browser preview against the reference layout — matches closely.
- Phase 4 (your music) not started — `public/audio/` is empty, `src/lib/scenes.ts` has one
  placeholder track with no `file` path (play button is disabled until a real file is added).
- Phase 5 (polish/deploy handoff) not started.
- Background image lives at `public/scenes/kerala-scene.png` (PNG, not yet converted to WebP).
- Not yet pushed to GitHub.
