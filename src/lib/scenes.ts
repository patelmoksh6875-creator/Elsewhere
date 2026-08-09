import type { Scene } from "@/types/scene";

// Add your own songs here. Drop the MP3 + album art into /public/audio,
// then add a matching entry to `tracks`. First track in the array plays first.
export const keralaScene: Scene = {
  id: "kerala-backwaters",
  name: "Kerala Backwaters",
  backgroundImage: "/scenes/kerala-scene.png",
  titleText: "केरल के खेत",
  titleFontClass: "font-title",
  timezone: "Asia/Kolkata",
  spotifyUrl: "https://open.spotify.com",
  ytMusicUrl: "https://music.youtube.com",
  tracks: [
    {
      id: "river-bird",
      title: "River Bird",
      artist: "Pawan Krishna",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/river-bird.mp3",
    },
    {
      id: "drizzle",
      title: "Drizzle",
      artist: "Unknown Artist",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/drizzle.mp3",
    },
    {
      id: "mera-desh",
      title: "Mera Desh",
      artist: "Pawan Krishna",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/mera-desh.mp3",
    },
    {
      id: "hope-dreamcatcher",
      title: "Hope (Dreamcatcher)",
      artist: "Ketan Mohite",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/hope-dreamcatcher.mp3",
    },
    {
      id: "nilaya",
      title: "Nilaya",
      artist: "Unknown Artist",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/nilaya.mp3",
    },
    {
      id: "sudhar",
      title: "Sudhar",
      artist: "Unknown Artist",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/sudhar.mp3",
    },
    {
      id: "baawariya",
      title: "Baawariya",
      artist: "Maatibaani feat. Shankar Tucker",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/baawariya.mp3",
    },
    {
      id: "i-wanted-to-leave-sitar",
      title: "I Wanted to Leave (Sitar Version)",
      artist: "Unknown Artist",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/i-wanted-to-leave-sitar.mp3",
    },
    {
      id: "gravity",
      title: "Gravity",
      artist: "Unknown Artist",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/gravity.mp3",
    },
    {
      id: "krishnas-dance",
      title: "Krishna's Dance",
      artist: "Unknown Artist",
      albumArt: "/scenes/kerala-scene.png",
      file: "/audio/krishnas-dance.mp3",
    },
  ],
};

export const scenes: Scene[] = [keralaScene];
