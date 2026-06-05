export interface Track {
  id: string;
  surahNo: number;
  ayahNumber: number;
  totalNumber: number;
  surahName: string;
  enName: string;
  arabicText: string;
  translationText: string;
  transliterationText: string;
  audioUrl: string;
  fallbackUrls: string[];
}

export type RepeatMode = "none" | "all" | "one";

export const REPEAT_CYCLE: RepeatMode[] = ["none", "all", "one"];

export interface AudioPlayerState {
  isExpanded: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  showPlaylist: boolean;
}

export interface AudioPlayerActions {
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setPlaylist: (tracks: Track[], startIndex?: number) => void;
  expand: () => void;
  minimize: () => void;
  togglePlaylist: () => void;
  setShowPlaylist: (show: boolean) => void;
}

export interface AudioPlayerContextType
  extends AudioPlayerState,
    AudioPlayerActions {}

export interface PlayerContentProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: { enName: string; ayahNumber: number };
  isShuffled: boolean;
  repeatMode: RepeatMode;
  togglePlay: () => void;
  prev: () => void;
  next: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  togglePlaylist: () => void;
  onMinimize: () => void;
}

export interface DesktopPlayerContentProps extends PlayerContentProps {
  volume: number;
  setVolume: (v: number) => void;
  muteToggle: () => void;
}
