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
