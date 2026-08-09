import Image from "next/image";
import { keralaScene } from "@/lib/scenes";
import { TopBar } from "@/components/TopBar";
import { SceneTitle } from "@/components/SceneTitle";
import { PlayerIsland } from "@/components/PlayerIsland";

export default function Home() {
  const scene = keralaScene;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <Image
        src={scene.backgroundImage}
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/10" />

      <TopBar timezone={scene.timezone} />
      <SceneTitle text={scene.titleText} fontClass={scene.titleFontClass} />
      <PlayerIsland tracks={scene.tracks} />
    </main>
  );
}
