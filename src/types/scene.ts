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
  label: string; // short name shown in the scene switcher menu, e.g. "Kerala"
  backgroundImage: string; // path under /public
  titleText: string; // rendered in scene's regional script
  titleFontClass: string; // tailwind font-family utility for the title
  subtitleText?: string; // optional small caption under the title, e.g. "(Old money version)"
  timezone: string | null; // IANA tz (e.g. "Asia/Kolkata"), or null to use the viewer's local time
  timeLabel: string; // small caption under the clock, e.g. "Kerela Time" or "Local Time"
  spotifyUrl: string;
  ytMusicUrl: string;
  tracks: Track[];
};
