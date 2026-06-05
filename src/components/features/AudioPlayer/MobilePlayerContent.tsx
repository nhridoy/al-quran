import {
  ChevronDownIcon,
  ListMusicIcon,
  Loader2Icon,
  PauseIcon,
  PlayIcon,
  Repeat1Icon,
  RepeatIcon as RepeatIconLucide,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import SeekBar from "./SeekBar";
import type { PlayerContentProps } from "./types";
import VinylDisc from "./VinylDisc";

export default function MobilePlayerContent({
  isPlaying,
  isLoading,
  currentTrack,
  isShuffled,
  repeatMode,
  togglePlay,
  prev,
  next,
  toggleShuffle,
  cycleRepeat,
  togglePlaylist,
  onMinimize,
}: Readonly<PlayerContentProps>) {
  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-[#1a0a2e] via-primary to-[#1a0a2e]">
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          type="button"
          onClick={togglePlaylist}
          className="cursor-pointer rounded-full p-2 text-white/70 transition-all hover:bg-white/10 active:scale-90"
          aria-label="Playlist"
          title="Playlist"
        >
          <ListMusicIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <h2 className="text-sm font-medium uppercase tracking-wider text-white/60">
          Now Playing
        </h2>
        <button
          type="button"
          onClick={onMinimize}
          className="cursor-pointer rounded-full p-2 text-white/70 transition-all hover:bg-white/10 active:scale-90"
          aria-label="Minimize"
          title="Minimize"
        >
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
        <VinylDisc isPlaying={isPlaying} size="lg" />
        <div className="w-full max-w-sm text-center">
          <p className="mb-1 text-2xl font-bold text-white">
            {currentTrack.enName}
          </p>
          <p className="text-sm text-white/60">
            Ayah {currentTrack.ayahNumber}
          </p>
        </div>
      </div>

      <div className="px-6 pb-4">
        <SeekBar />
      </div>

      <div className="flex items-center justify-center gap-4 px-6 pb-12">
        <button
          type="button"
          onClick={toggleShuffle}
          className={`cursor-pointer rounded-full p-3 transition-all active:scale-90 ${
            isShuffled
              ? "bg-white/10 text-secondary"
              : "text-white/60 hover:bg-white/10"
          }`}
          aria-label="Toggle shuffle"
          title="Shuffle"
        >
          <ShuffleIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={prev}
          className="cursor-pointer rounded-full p-3 text-white/80 transition-all hover:bg-white/10 active:scale-90"
          aria-label="Previous"
          title="Previous"
        >
          <SkipBackIcon className="h-8 w-8" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="cursor-pointer rounded-full bg-white p-5 text-primary shadow-2xl transition-transform hover:scale-105 active:scale-95"
          aria-label={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
          title={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <Loader2Icon className="h-8 w-8 animate-spin" aria-hidden="true" />
          ) : isPlaying ? (
            <PauseIcon className="h-8 w-8" aria-hidden="true" />
          ) : (
            <PlayIcon className="ml-1 h-8 w-8" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={next}
          className="cursor-pointer rounded-full p-3 text-white/80 transition-all hover:bg-white/10 active:scale-90"
          aria-label="Next"
          title="Next"
        >
          <SkipForwardIcon className="h-8 w-8" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={cycleRepeat}
          className={`cursor-pointer rounded-full p-3 transition-all active:scale-90 ${
            repeatMode === "none"
              ? "text-white/60 hover:bg-white/10"
              : "bg-white/10 text-secondary"
          }`}
          aria-label="Cycle repeat mode"
          title={
            repeatMode === "none"
              ? "Repeat"
              : repeatMode === "all"
                ? "Repeat all"
                : "Repeat one"
          }
        >
          {repeatMode === "one" ? (
            <Repeat1Icon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <RepeatIconLucide className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
