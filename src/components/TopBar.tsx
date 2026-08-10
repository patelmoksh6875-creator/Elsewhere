"use client";

import { useEffect, useRef, useState } from "react";

function formatSceneTime(timezone: string | null) {
  const parts = new Intl.DateTimeFormat("en-US", {
    // Omitting timeZone entirely (rather than passing undefined explicitly
    // in the object) falls back to the viewer's own local timezone.
    ...(timezone ? { timeZone: timezone } : {}),
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

function getClientId() {
  const key = "kerala-radio-client-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Real presence: heartbeats to /api/presence every 10s, which reports how
// many distinct tabs have pinged in the last ~25s (see route.ts).
function usePresenceCount() {
  const [count, setCount] = useState(1);
  const clientIdRef = useRef<string | null>(null);

  useEffect(() => {
    clientIdRef.current = getClientId();

    const beat = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: clientIdRef.current }),
        });
        const data = await res.json();
        if (typeof data.count === "number") setCount(data.count);
      } catch {
        // network hiccup — keep showing the last known count
      }
    };

    beat();
    const id = setInterval(beat, 10_000);
    return () => clearInterval(id);
  }, []);

  return count;
}

export function TopBar({
  timezone,
  timeLabel,
}: {
  timezone: string | null;
  timeLabel: string;
}) {
  const [time, setTime] = useState<string | null>(null);
  const presence = usePresenceCount();

  useEffect(() => {
    setTime(formatSceneTime(timezone));
    const id = setInterval(() => setTime(formatSceneTime(timezone)), 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const textShadow = { textShadow: "0 1px 6px rgba(0,0,0,0.5)" };

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-start px-6 py-6 text-white">
      <div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <span
            className="font-clock text-4xl font-bold tabular-nums leading-none sm:text-5xl"
            style={textShadow}
          >
            {time ?? " "}
          </span>
        </div>
        <div
          className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold tracking-widest text-white/70"
          style={textShadow}
        >
          <span>{timeLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            {presence} online
          </span>
        </div>
      </div>
    </div>
  );
}
