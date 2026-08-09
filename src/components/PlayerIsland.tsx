"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/types/scene";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerIsland({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[index];
  const hasFile = Boolean(track?.file);

  useEffect(() => {
    setCurrent(0);
    setIsPlaying(false);
  }, [index]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !hasFile) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setIndex((i) => (i + 1) % tracks.length);

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const value = Number(e.target.value);
    if (audio) audio.currentTime = value;
    setCurrent(value);
  };

  return (
    <div
      className="absolute bottom-20 left-1/2 z-10 flex w-fit -translate-x-1/2 items-center gap-6 rounded-full border px-8 py-5 text-white"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        borderColor: "var(--glass-border)",
      }}
    >
      <audio
        ref={audioRef}
        src={track?.file || undefined}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={track?.albumArt}
        alt=""
        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
      />

      <div className="flex w-44 flex-col leading-tight">
        <span className="truncate text-base font-semibold">{track?.title}</span>
        <span className="truncate text-sm text-white/60">{track?.artist}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous track"
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>
        <button
          onClick={togglePlay}
          disabled={!hasFile}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px] fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          onClick={next}
          aria-label="Next track"
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M16 6h2v12h-2zM6 6v12l8.5-6z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={onScrub}
          disabled={!hasFile}
          className="h-1 w-36 cursor-pointer accent-white disabled:cursor-not-allowed"
        />
        <span className="w-24 text-right text-sm tabular-nums text-white/70">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
