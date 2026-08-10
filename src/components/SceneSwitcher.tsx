"use client";

import { useEffect, useRef, useState } from "react";
import type { Scene } from "@/types/scene";

// Bottom-right preset switcher: collapsed to a small glass pill with a
// layers icon, expands into a list of scenes on click. Generic over
// `scenes` — adding a new preset to src/lib/scenes.ts is the only change
// needed for it to show up here.
export function SceneSwitcher({
  scenes,
  activeId,
  onSelect,
}: {
  scenes: Scene[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const select = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  const glass = {
    background: "var(--glass-bg)",
    backdropFilter: "blur(var(--glass-blur))",
    WebkitBackdropFilter: "blur(var(--glass-blur))",
    borderColor: "var(--glass-border)",
  };

  return (
    <div ref={rootRef} className="absolute bottom-8 right-6 z-20 flex flex-col items-end gap-2">
      <div
        className={`origin-bottom-right overflow-hidden rounded-2xl border text-white transition-all duration-300 ease-out ${
          open
            ? "max-h-64 w-40 scale-100 opacity-100"
            : "pointer-events-none max-h-0 w-40 scale-95 opacity-0"
        }`}
        style={glass}
      >
        <ul className="flex flex-col p-1.5">
          {scenes.map((scene) => (
            <li key={scene.id}>
              <button
                onClick={() => select(scene.id)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  scene.id === activeId
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {scene.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close scene switcher" : "Open scene switcher"}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full border text-white transition-transform duration-300 ease-out hover:scale-105"
        style={glass}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M12 2 2 7l10 5 10-5-10-5Zm0 8.5L2 15.5l10 5 10-5-10-5Z" />
        </svg>
      </button>
    </div>
  );
}
