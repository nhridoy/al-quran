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
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  useAudioProgressStore,
  useAudioVolumeStore,
} from "../../../store/audio";
import {
  formatTime,
  useAudioPlayerActions,
  useAudioPlayerState,
} from "./AudioPlayerContext";
import VinylDisc from "./VinylDisc";

function SeekBar() {
  const currentTime = useAudioProgressStore((s) => s.currentTime);
  const duration = useAudioProgressStore((s) => s.duration);
  const { seek } = useAudioPlayerActions();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const seekFnRef = useRef(seek);
  const durationRef = useRef(duration);
  useEffect(() => {
    seekFnRef.current = seek;
  }, [seek]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const handleSeek = (clientX: number) => {
    const bar = barRef.current;
    const dur = durationRef.current;
    if (!bar || dur <= 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekFnRef.current(ratio * dur);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleSeekRef = useRef(handleSeek);
  useEffect(() => {
    handleSeekRef.current = handleSeek;
  });

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleSeekRef.current(e.clientX);
    const onMouseUp = () => setIsDragging(false);
    globalThis.addEventListener("mousemove", onMouseMove);
    globalThis.addEventListener("mouseup", onMouseUp);
    return () => {
      globalThis.removeEventListener("mousemove", onMouseMove);
      globalThis.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex w-full items-center gap-3">
      <span className="w-10 text-right text-xs tabular-nums text-text-muted dark:text-dark-text-muted">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        className="relative flex-1 h-2 cursor-pointer rounded-full bg-border dark:bg-dark-border group"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-linear-to-r from-secondary to-primary transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-secondary bg-white shadow-md opacity-0 transition-opacity dark:bg-gray-200 group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
      <span className="w-10 text-xs tabular-nums text-text-muted dark:text-dark-text-muted">
        {formatTime(duration)}
      </span>
    </div>
  );
}

function PlayPauseButton({
  isPlaying,
  isLoading,
  onClick,
}: {
  isPlaying: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full bg-linear-to-r from-primary to-secondary p-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      aria-label={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
      title={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
    >
      {isLoading ? (
        <Loader2Icon className="h-6 w-6 animate-spin" aria-hidden="true" />
      ) : isPlaying ? (
        <PauseIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <PlayIcon className="ml-0.5 h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}

const PrevButton = memo(function PrevButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full p-2 text-text-secondary transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
      aria-label="Previous"
      title="Previous"
    >
      <SkipBackIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
});

const NextButton = memo(function NextButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full p-2 text-text-secondary transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
      aria-label="Next"
      title="Next"
    >
      <SkipForwardIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
});

const ShuffleButton = memo(function ShuffleButton({
  isShuffled,
  onClick,
}: {
  isShuffled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full p-2 transition-all active:scale-90 ${
        isShuffled
          ? "bg-secondary/10 text-secondary"
          : "text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
      }`}
      aria-label="Toggle shuffle"
      title="Shuffle"
    >
      <ShuffleIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
});

const RepeatButton = memo(function RepeatButton({
  mode,
  onClick,
}: {
  mode: "none" | "all" | "one";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full p-2 transition-all active:scale-90 ${
        mode === "none"
          ? "text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
          : "bg-secondary/10 text-secondary"
      }`}
      aria-label="Cycle repeat mode"
      title={
        mode === "none"
          ? "Repeat"
          : mode === "all"
            ? "Repeat all"
            : "Repeat one"
      }
    >
      {mode === "one" ? (
        <Repeat1Icon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <RepeatIconLucide className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
});

const MuteButton = memo(function MuteButton({
  volume,
  onToggle,
}: {
  volume: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="cursor-pointer rounded-full p-2 text-text-muted transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
      aria-label="Toggle mute"
      title={volume === 0 ? "Unmute" : "Mute"}
    >
      {volume === 0 ? (
        <VolumeXIcon className="h-5 w-5" aria-hidden="true" />
      ) : volume < 0.5 ? (
        <Volume1Icon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Volume2Icon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
});

const PlaylistButton = memo(function PlaylistButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full p-2 text-text-muted transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
      aria-label="Playlist"
      title="Playlist"
    >
      <ListMusicIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
});

const MinimizeButton = memo(function MinimizeButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full p-2 text-text-muted transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
      aria-label="Minimize"
      title="Minimize"
    >
      <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
});

function DesktopPlayerContent({
  isPlaying,
  isLoading,
  currentTrack,
  isShuffled,
  repeatMode,
  volume,
  togglePlay,
  prev,
  next,
  toggleShuffle,
  cycleRepeat,
  setVolume,
  togglePlaylist,
  onMinimize,
  muteToggle,
}: Readonly<{
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: { enName: string; ayahNumber: number };
  isShuffled: boolean;
  repeatMode: "none" | "all" | "one";
  volume: number;
  togglePlay: () => void;
  prev: () => void;
  next: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (v: number) => void;
  togglePlaylist: () => void;
  onMinimize: () => void;
  muteToggle: () => void;
}>) {
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setVolume(Number.parseFloat(e.target.value)),
    [setVolume],
  );

  return (
    <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <VinylDisc isPlaying={isPlaying} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            {currentTrack.enName}
          </p>
          <p className="truncate text-xs text-text-muted dark:text-dark-text-muted">
            Ayah {currentTrack.ayahNumber}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3">
        <SeekBar />
        <div className="flex items-center gap-1">
          <ShuffleButton isShuffled={isShuffled} onClick={toggleShuffle} />
          <PrevButton onClick={prev} />
          <PlayPauseButton
            isPlaying={isPlaying}
            isLoading={isLoading}
            onClick={togglePlay}
          />
          <NextButton onClick={next} />
          <RepeatButton mode={repeatMode} onClick={cycleRepeat} />
        </div>
        <div className="flex items-center gap-1">
          <MuteButton volume={volume} onToggle={muteToggle} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-border dark:bg-dark-border [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
            style={{
              backgroundImage: `linear-gradient(to right, #9345f2 ${volume * 100}%, transparent ${volume * 100}%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <PlaylistButton onClick={togglePlaylist} />
        <MinimizeButton onClick={onMinimize} />
      </div>
    </div>
  );
}

function MobilePlayerContent({
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
}: Readonly<{
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: { enName: string; ayahNumber: number };
  isShuffled: boolean;
  repeatMode: "none" | "all" | "one";
  togglePlay: () => void;
  prev: () => void;
  next: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  togglePlaylist: () => void;
  onMinimize: () => void;
}>) {
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

function TopProgressBar() {
  const currentTime = useAudioProgressStore((s) => s.currentTime);
  const duration = useAudioProgressStore((s) => s.duration);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-border dark:bg-dark-border">
      <div
        className="h-full bg-linear-to-r from-secondary to-primary transition-[width] duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

const MemoizedDesktopContent = memo(DesktopPlayerContent);
const MemoizedMobileContent = memo(MobilePlayerContent);

export default function ExpandedPlayer() {
  const [leaving, setLeaving] = useState(false);
  const {
    isExpanded,
    isPlaying,
    isLoading,
    currentTrack,
    isShuffled,
    repeatMode,
  } = useAudioPlayerState();
  const volume = useAudioVolumeStore((s) => s.volume);
  const {
    minimize,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    togglePlaylist,
  } = useAudioPlayerActions();

  const handleMinimize = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      minimize();
      setLeaving(false);
    }, 300);
  }, [minimize]);

  const handleTogglePlay = useCallback(() => togglePlay(), [togglePlay]);
  const handlePrev = useCallback(() => prev(), [prev]);
  const handleNext = useCallback(() => next(), [next]);
  const handleToggleShuffle = useCallback(
    () => toggleShuffle(),
    [toggleShuffle],
  );
  const handleCycleRepeat = useCallback(() => cycleRepeat(), [cycleRepeat]);
  const handleSetVolume = useCallback((v: number) => setVolume(v), [setVolume]);
  const handleMuteToggle = useCallback(
    () => setVolume(volume === 0 ? 0.7 : 0),
    [setVolume, volume],
  );
  const handleTogglePlaylist = useCallback(
    () => togglePlaylist(),
    [togglePlaylist],
  );

  useEffect(() => {
    if (isExpanded) setLeaving(false);
  }, [isExpanded]);

  if ((!isExpanded && !leaving) || !currentTrack) return null;

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 hidden border-t border-border bg-surface/95 shadow-2xl backdrop-blur-lg dark:border-dark-border dark:bg-dark-surface/95 md:block ${
          leaving
            ? "translate-y-full opacity-0 transition-all duration-300 ease-in-out"
            : "animate-slide-up"
        }`}
      >
        <TopProgressBar />
        <MemoizedDesktopContent
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTrack={currentTrack}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          volume={volume}
          togglePlay={handleTogglePlay}
          prev={handlePrev}
          next={handleNext}
          toggleShuffle={handleToggleShuffle}
          cycleRepeat={handleCycleRepeat}
          setVolume={handleSetVolume}
          togglePlaylist={handleTogglePlaylist}
          onMinimize={handleMinimize}
          muteToggle={handleMuteToggle}
        />
      </div>

      <div
        className={`fixed inset-0 z-50 flex flex-col md:hidden ${
          leaving
            ? "opacity-0 transition-all duration-300 ease-in-out"
            : "animate-fade-in"
        }`}
      >
        <MemoizedMobileContent
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTrack={currentTrack}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          togglePlay={handleTogglePlay}
          prev={handlePrev}
          next={handleNext}
          toggleShuffle={handleToggleShuffle}
          cycleRepeat={handleCycleRepeat}
          togglePlaylist={handleTogglePlaylist}
          onMinimize={handleMinimize}
        />
      </div>
    </>
  );
}
