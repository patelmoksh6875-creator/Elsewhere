# Kerala Radio

An ambient Kerala backwaters scene — live "local" clock, glassmorphic music player, your own songs.

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

## Dev

```bash
npm run dev
```

## Deploy

Push to `main` and import the repo on [Vercel](https://vercel.com/new) — no config needed, it's a
standard Next.js app.

See [PROJECT.md](PROJECT.md) for scope, decisions, and current state.
