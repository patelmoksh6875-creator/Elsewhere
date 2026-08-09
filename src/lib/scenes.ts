import type { Scene } from "@/types/scene";

// Add your own songs here. Drop the MP3 + album art into /public/audio,
// then add a matching entry to `tracks`. First track in the array plays first.
export const keralaScene: Scene = {
  id: "kerala-backwaters",
  name: "Kerala Backwaters",
  backgroundImage: "/scenes/kerala-scene.png",
  titleText: "केरल",
  titleFontClass: "font-title",
  timezone: "Asia/Kolkata",
  spotifyUrl: "https://open.spotify.com",
  ytMusicUrl: "https://music.youtube.com",
  tracks: [
    {
      id: "placeholder",
      title: "Add your first song",
      artist: "Drop an MP3 in /public/audio",
      albumArt: "/scenes/kerala-scene.png",
      file: "",
    },
  ],
};

export const scenes: Scene[] = [keralaScene];
