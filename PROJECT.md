# Elsewhere

## Done means
A deployable Next.js multi-scene ambient site (Kerala, Summer, The Grind — more addable as data
entries) with a bottom-right preset switcher, each scene's background/title/local-time-or-fixed-
timezone clock crossfading in, and a glassmorphic music player that plays the user's own uploaded
MP3s per scene.

## Anti-goals (v1)
- No auth or user accounts
- No perfected mobile layout (desktop-first; must not be broken on mobile, but not polished)
- Additional presets beyond what's already shipped (Kerala, Summer, The Grind) are out of scope
  until their art/songs are supplied — the switcher and data model are generic over N scenes, so
  adding one is a `scenes.ts` entry away, just not scaffolded speculatively

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
- 2026-08-09 — User reported the above onPause wiring actually broke continuous playback:
  skipping tracks or reaching the end of a track paused playback instead of flowing into the
  next one. Root cause: the browser fires a native 'pause' event both when a track ends
  naturally and (in some browsers) when `src` changes — our onPause handler was treating both
  as if the user had clicked pause. Fixed by removing onPause entirely (pausing is now only ever
  set explicitly, inside togglePlay's own click handler) and no longer resetting `isPlaying` on
  track change. A new effect keyed on `track.file` calls `audio.play()` on the newly-loaded
  track whenever playback was in progress (tracked via an `isPlayingRef` mirror, read without
  making the effect depend on `isPlaying` itself) — so skip/prev/auto-advance-on-end all continue
  playing uninterrupted, and only an explicit pause click actually stops it.
- 2026-08-09 — Evolved from a single-scene page into a multi-scene switcher, per a second handoff
  doc (`SCENE_SWITCHER_HANDOFF.md`). Added a "Summer" scene (coastal-highway golden-hour art,
  English title, viewer's local time instead of a fixed timezone — `Scene.timezone` is now
  `string | null`, `null` meaning "use local"). Added `Scene.label` (short switcher-menu name,
  distinct from the existing longer `name`) and `Scene.timeLabel` (small caption under the clock,
  e.g. "Kerela Time" vs "Local Time" — kept the user's own "Kerela" spelling from their earlier
  direct GitHub edit rather than "fixing" it). Deviated from the handoff doc in one place: it
  described a Spotify iFrame API for music and called the presence counter "still decorative" —
  both are stale relative to this project's actual state (local MP3s, real presence counter via
  Upstash), so those parts of the doc were ignored in favor of what's already built.
- 2026-08-09 — Scene switching implemented as: `SceneExperience` (new client component) holds
  `activeId` state and renders every scene's background `<Image>` simultaneously, stacked, with
  only the active one at `opacity-100` (rest at `opacity-0`) and a `transition-opacity
  duration-700` — this crossfades instead of hard-cutting, and switching back to an
  already-visited scene is instant with no reload flash since nothing unmounts. `TopBar` and
  `SceneTitle` stay mounted across switches and just receive new props. `PlayerIsland` is
  `key={activeScene.id}`'d, so switching scenes fully remounts it (old audio stops immediately,
  new scene's tracks start fresh at track 1) rather than trying to patch a live player's track
  list mid-state — simpler and more robust than the alternative, and indistinguishable from
  "persistent" to the user since it occupies the same DOM position with no visible flash.
- 2026-08-09 — New `SceneSwitcher` component: bottom-right glass pill (`bottom-8 right-6`, clear
  of the player island), expands into a scene list on click with a 300ms `ease-out` transition,
  closes on selecting a scene or clicking outside. Generic over the `scenes` array — a new preset
  is a `scenes.ts` data entry, no UI code changes needed.

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
- Background images live at `public/scenes/kerala-scene.png`, `public/scenes/summer-scene.png`,
  and `public/scenes/grind-scene.png` (PNG, not yet converted to WebP).
- Multi-scene switcher done: Kerala, Summer, and The Grind all selectable via the bottom-right
  pill, crossfade verified working across all three (including instant switch-back with no reload
  flash). The Grind has no songs yet — placeholder track, same pattern Kerala/Summer started with.
- Anti-goal "No multi-scene switcher UI" (see above) is now stale/superseded by this session's
  work — a future session should update it rather than treat it as still in force.
- 2026-08-09 — Summer scene's 25 songs added (user's own files, from `~/Documents/Songs summer/`),
  same pattern as Kerala: copied into `public/audio/`, filenames slugified, title/artist parsed
  from filenames (no ID3 tags present). One exact duplicate file
  (`Empire of the Sun - We Are The People (Lyrics) (1).mp3`, byte-identical to the non-`(1)`
  version) was skipped rather than imported twice. A few tracks with ambiguous/no artist in the
  filename (Paradise, The Weight Of Attraction, We're Getting Older, Coca White) are labeled
  "Unknown Artist", same convention as Kerala's unknowns — correct in `scenes.ts` if known.
  Verified in-browser: first track loads with correct duration, playback works, and skipping
  through all 25 tracks in sequence lands correctly on the last one with continuous playback held
  throughout (confirms the earlier continuous-flow fix generalizes across a full scene switch +
  full playlist, not just the 2-3 tracks it was tested with originally).
- Pushed to GitHub (`main`) through the multi-scene-switcher commit; Summer's song library is
  queued to commit next. Not yet deployed to Vercel (user will deploy themselves).
- 2026-08-10 — Project renamed from "Kerala Radio" to "Elsewhere" (site now covers multiple scenes
  beyond just Kerala, so the old name undersold it). Renamed the GitHub repo itself via `gh repo
  rename` (URL is now `github.com/patelmoksh6875-creator/Elsewhere`, local `origin` remote updated
  to match) and updated the site's `<title>`/metadata, `package.json` name, README, and this file's
  heading. Local folder path (`kerala-radio/`) and internal scene id `kerala-backwaters` were left
  alone — purely cosmetic/user-facing naming changed, nothing structural. (Note: the user separately
  renamed the local project folder itself to `Elsewhere/` shortly after — `.claude/launch.json`'s
  dev-server config was updated to match, prefix `Elsewhere` instead of `kerala-radio`.)
- 2026-08-10 — Added a third scene, "The Grind" (dev-team-working-late office illustration).
  Followed the same pattern as Summer: local time (not fixed timezone), placeholder track
  awaiting songs. New this time: a second title font, Archivo Black (`--font-title-blocky`,
  `font-title-blocky` Tailwind class), used only for this scene — explicitly requested to be a
  "more blocky" look distinct from Yatra One (used by Kerala and Summer). `Scene.titleFontClass`
  already supported per-scene fonts from the original design, so this needed no type changes.
  Verified in browser: crossfades in correctly, title renders in the new font, no console errors.
