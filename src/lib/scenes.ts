import type { Scene } from "@/types/scene";

// Add your own songs here. Drop the MP3 + album art into /public/audio,
// then add a matching entry to `tracks`. First track in the array plays first.
export const keralaScene: Scene = {
  id: "kerala-backwaters",
  name: "Kerala Backwaters",
  label: "Kerala",
  backgroundImage: "/scenes/kerala-scene.png",
  titleText: "केरल के खेत",
  titleFontClass: "font-title",
  timezone: "Asia/Kolkata",
  timeLabel: "Kerela Time",
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

// Waiting on songs for this scene — user will supply an MP3 folder later,
// same as the Kerala scene originally started with an empty placeholder.
export const summerScene: Scene = {
  id: "summer-coast",
  name: "Summer Coast",
  label: "Summer",
  backgroundImage: "/scenes/summer-scene.png",
  titleText: "Summer",
  titleFontClass: "font-title",
  timezone: null,
  timeLabel: "Local Time",
  spotifyUrl: "https://open.spotify.com",
  ytMusicUrl: "https://music.youtube.com",
  tracks: [
    {
      id: "placeholder",
      title: "Add your first song",
      artist: "Drop an MP3 in /public/audio",
      albumArt: "/scenes/summer-scene.png",
      file: "",
    },
  ],
};

// Add new presets here — the switcher UI and scene-transition logic are
// both generic over this array, so a new entry is the only change needed.
export const scenes: Scene[] = [keralaScene, summerScene];
