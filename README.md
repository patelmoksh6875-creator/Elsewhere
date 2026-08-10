# Elsewhere

A multi-scene ambient radio — Kerala backwaters, summer coast, more scenes addable as data entries.
Live "local" clock per scene, glassmorphic music player, your own songs.

## Adding your own songs

1. Drop the MP3 and its album art into `public/audio/`.
2. Add an entry to the `tracks` array in [`src/lib/scenes.ts`](src/lib/scenes.ts):

```ts
{
  id: "unique-id",
  title: "Song Title",
  artist: "Artist Name",
  albumArt: "/audio/your-cover.jpg",
  file: "/audio/your-song.mp3",
},
```

The first track in the array plays first; prev/next cycles through the list.

## Real presence counter (optional but recommended)

The "N online" counter is real — it counts distinct browser tabs that have pinged the app in the
last ~25 seconds. It needs a tiny free Redis database to store that in:

1. Create a free database at [upstash.com](https://upstash.com) (or add the Upstash integration
   from your Vercel project's Storage tab — it sets the env vars for you automatically).
2. Grab the REST URL and token and add them as env vars — locally in `.env.local`, and on Vercel
   under Project Settings → Environment Variables:
   ```
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   ```
3. Redeploy. Without these set, the counter safely shows "1" instead of breaking.

## Dev

```bash
npm run dev
```

## Deploy

Push to `main` and import the repo on [Vercel](https://vercel.com/new) — no config needed, it's a
standard Next.js app.

See [PROJECT.md](PROJECT.md) for scope, decisions, and current state.
