import { useAudioStore } from "@/store/audio";
import ExpandedPlayer from "./ExpandedPlayer";
import MiniPlayer from "./MiniPlayer";
import PlaylistDrawer from "./PlaylistDrawer";

export default function AudioPlayer() {
  const currentTrack = useAudioStore((s) => s.currentTrack);
  if (!currentTrack) return null;

  return (
    <>
      <MiniPlayer />
      <ExpandedPlayer />
      <PlaylistDrawer />
    </>
  );
}

export { useAudioStore } from "@/store/audio";
export {
  buildPlaylistFromSurah,
  buildPlaylistFromSurahs,
  formatTime,
} from "./audioUtils";
export type { RepeatMode, Track } from "./types";
