import { useAudioPlayer } from "./AudioPlayerContext";
import ExpandedPlayer from "./ExpandedPlayer";
import MiniPlayer from "./MiniPlayer";
import PlaylistDrawer from "./PlaylistDrawer";

export default function AudioPlayer() {
  const { currentTrack } = useAudioPlayer();
  if (!currentTrack) return null;

  return (
    <>
      <MiniPlayer />
      <ExpandedPlayer />
      <PlaylistDrawer />
    </>
  );
}

export {
  AudioPlayerProvider,
  buildPlaylistFromSurah,
  formatTime,
  getAudioUrl,
  useAudioPlayer,
} from "./AudioPlayerContext";
export type { RepeatMode, Track } from "./types";
