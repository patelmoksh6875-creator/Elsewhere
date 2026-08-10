import { scenes } from "@/lib/scenes";
import { SceneExperience } from "@/components/SceneExperience";

export default function Home() {
  return <SceneExperience scenes={scenes} />;
}
