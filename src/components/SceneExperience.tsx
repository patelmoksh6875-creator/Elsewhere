"use client";

import Image from "next/image";
import { useState } from "react";
import type { Scene } from "@/types/scene";
import { TopBar } from "@/components/TopBar";
import { SceneTitle } from "@/components/SceneTitle";
import { PlayerIsland } from "@/components/PlayerIsland";
import { SceneSwitcher } from "@/components/SceneSwitcher";

export function SceneExperience({ scenes }: { scenes: Scene[] }) {
  const [activeId, setActiveId] = useState(scenes[0].id);
  const activeScene = scenes.find((s) => s.id === activeId) ?? scenes[0];

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      {/* All scene backgrounds stay mounted, stacked, and crossfade via
          opacity — only the active one is visible. Keeping every scene's
          image in the DOM (rather than swapping `src` on one <Image>) is
          what makes the fade-out/fade-in transition possible instead of a
          hard cut, and it means a scene you've already visited switches
          back instantly with no reload flash. */}
      {scenes.map((scene) => (
        <Image
          key={scene.id}
          src={scene.backgroundImage}
          alt=""
          fill
          priority={scene.id === scenes[0].id}
          className={`object-cover object-center transition-opacity duration-700 ease-in-out ${
            scene.id === activeId ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/10" />

      {/* Persistent chrome: same component instances across every scene
          switch, only their content props change. */}
      <TopBar timezone={activeScene.timezone} timeLabel={activeScene.timeLabel} />
      <SceneTitle text={activeScene.titleText} fontClass={activeScene.titleFontClass} />
      {/* Keyed by scene id so the player fully resets to track 1 of the new
          scene's playlist on switch — old track stops, new one is ready to
          play, rather than trying to splice a new tracks array into
          mid-playback state. */}
      <PlayerIsland key={activeScene.id} tracks={activeScene.tracks} />

      <SceneSwitcher scenes={scenes} activeId={activeId} onSelect={setActiveId} />
    </main>
  );
}
