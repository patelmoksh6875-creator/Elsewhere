"use client";

import { useEffect, useState } from "react";

function formatSceneTime(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});

  return `${parts.hour}:${parts.minute} ${parts.dayPeriod?.toLowerCase()}`;
}

// Decorative "online" count — fake per spec, drifts gently instead of jumping around.
function usePresenceCount(seed: number) {
  const [count, setCount] = useState(seed);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(1, c + delta);
      });
    }, 8000);
    return () => clearInterval(id);
  }, []);
  return count;
}

export function TopBar({
  timezone,
  spotifyUrl,
  ytMusicUrl,
}: {
  timezone: string;
  spotifyUrl: string;
  ytMusicUrl: string;
}) {
  const [time, setTime] = useState<string | null>(null);
  const presence = usePresenceCount(40);

  useEffect(() => {
    setTime(formatSceneTime(timezone));
    const id = setInterval(() => setTime(formatSceneTime(timezone)), 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const textShadow = { textShadow: "0 1px 6px rgba(0,0,0,0.5)" };

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 text-white">
      <div className="text-sm font-medium tabular-nums" style={textShadow}>
        {time ?? " "}
      </div>

      <div className="flex items-center gap-2 text-sm font-medium" style={textShadow}>
        <span className="inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
        {presence} online
      </div>

      <div className="flex items-center gap-5 text-sm font-medium">
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={textShadow}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.161-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.439 1.62.361.181.54.78.302 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.72-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Spotify ↗
        </a>
        <a
          href={ytMusicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={textShadow}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 19.09a7.09 7.09 0 1 1 0-14.18 7.09 7.09 0 0 1 0 14.18zm0-12.81a5.72 5.72 0 1 0 0 11.44 5.72 5.72 0 0 0 0-11.44zM9.68 15.6V8.4l6.24 3.6-6.24 3.6z" />
          </svg>
          YT Music ↗
        </a>
      </div>
    </div>
  );
}
