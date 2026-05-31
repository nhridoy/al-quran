import { useAudioPlayerState } from "./AudioPlayerContext";
import ExpandedPlayer from "./ExpandedPlayer";
import MiniPlayer from "./MiniPlayer";
import PlaylistDrawer from "./PlaylistDrawer";

export default function AudioPlayer() {
  const { currentTrack } = useAudioPlayerState();
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
  buildPlaylistFromSurahs,
  formatTime,
  useAudioPlayer,
  useAudioPlayerActions,
  useAudioPlayerState,
} from "./AudioPlayerContext";
export type { RepeatMode, Track } from "./types";
