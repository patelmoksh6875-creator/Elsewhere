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

  // Mirrors `isPlaying` without being a dependency of the track-change
  // effect below — lets that effect read "were we playing" without
  // re-running every time isPlaying itself flips.
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const track = tracks[index];
  const hasFile = Boolean(track?.file);

  // Track changed (skip, prev, or auto-advance on end) — reset the
  // scrubber, and if we were mid-playback, keep going into the new track
  // instead of leaving it paused. Intentionally does NOT reset isPlaying:
  // that's the whole point of "continuous flow" — only the user's own
  // pause action should ever stop playback.
  useEffect(() => {
    setCurrent(0);
    setDuration(0);
    const audio = audioRef.current;
    if (audio && hasFile && isPlayingRef.current) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [track?.file, hasFile]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !hasFile) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
    }
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
        onTimeUpdate={(e) => {
          // Also sync duration here, not just in onLoadedMetadata: when a
          // file loads fast (e.g. from cache) that event can fire before
          // React finishes attaching the listener and gets missed entirely,
          // leaving duration stuck at 0. timeupdate fires repeatedly during
          // playback, so it's a reliable fallback.
          setCurrent(e.currentTarget.currentTime);
          if (Number.isFinite(e.currentTarget.duration)) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        // No onPause handler: the browser also fires 'pause' when a track
        // ends naturally (and, in some browsers, when src changes), which
        // would otherwise clear isPlaying and break continuous flow.
        // Pausing is only ever set explicitly, from the user's own click
        // in togglePlay.
        onPlay={() => setIsPlaying(true)}
        onEnded={next}
      />

      <div className="relative h-16 w-16 flex-shrink-0">
        {/* Vinyl record: spins while playing, holds its angle when paused
            (animation-play-state, not conditional rendering, so it doesn't
            snap back to 0deg every pause). */}
        <div
          className={`h-16 w-16 rounded-full shadow-lg ${isPlaying ? "vinyl-spin" : ""}`}
          style={{
            background:
              "repeating-radial-gradient(circle at center, #2a2a2a 0px, #2a2a2a 1px, #0c0c0c 1px, #0c0c0c 3px)",
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.18),transparent_45%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track?.albumArt}
            alt=""
            className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover ring-1 ring-black/50"
          />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
        </div>
      </div>

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
