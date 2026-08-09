export type Track = {
  id: string;
  title: string;
  artist: string;
  albumArt: string; // path under /public
  file: string; // path under /public
};

export type Scene = {
  id: string;
  name: string;
  backgroundImage: string; // path under /public
  titleText: string; // rendered in scene's regional script
  titleFontClass: string; // tailwind font-family utility for the title
  timezone: string; // IANA tz, e.g. "Asia/Kolkata"
  spotifyUrl: string;
  ytMusicUrl: string;
  tracks: Track[];
};
