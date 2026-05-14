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
}

export type RepeatMode = "none" | "all" | "one";

export interface AudioPlayerState {
  isExpanded: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  currentTime: number;
  duration: number;
  showPlaylist: boolean;
}

export interface AudioPlayerContextType extends AudioPlayerState {
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setPlaylist: (tracks: Track[], startIndex?: number) => void;
  expand: () => void;
  minimize: () => void;
  togglePlaylist: () => void;
  setShowPlaylist: (show: boolean) => void;
  formatTime: (seconds: number) => string;
}
