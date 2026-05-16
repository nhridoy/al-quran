import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

function RepeatIcon({ mode }: { mode: "none" | "all" | "one" }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      {mode === "one" && (
        <text
          x="12"
          y="15"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="currentColor"
        >
          1
        </text>
      )}
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function PlaylistIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function Spinner({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={`${className ?? "h-5 w-5"} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function VolumeIcon({ volume }: Readonly<{ volume: number }>) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {volume === 0 ? (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : volume < 0.5 ? (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </>
      ) : (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  );
}

function SeekBar() {
  const { currentTime, duration, seek, formatTime } = useAudioPlayer();
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
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
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
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-[width] duration-100"
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

function VinylDisc({ isPlaying }: Readonly<{ isPlaying: boolean }>) {
  return (
    <div className="relative shrink-0">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-600 shadow-lg ring-2 ring-gray-300 dark:ring-gray-600 ${
          isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
        }`}
      >
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
    </div>
  );
}

export default function ExpandedPlayer() {
  const [leaving, setLeaving] = useState(false);
  const {
    isExpanded,
    isPlaying,
    isLoading,
    currentTrack,
    minimize,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    isShuffled,
    cycleRepeat,
    repeatMode,
    volume,
    setVolume,
    togglePlaylist,
    currentTime,
    duration,
  } = useAudioPlayer();

  const handleMinimize = () => {
    setLeaving(true);
    setTimeout(() => {
      minimize();
      setLeaving(false);
    }, 300);
  };

  useEffect(() => {
    if (isExpanded) setLeaving(false);
  }, [isExpanded]);

  if ((!isExpanded && !leaving) || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 hidden border-t border-border bg-surface/95 shadow-2xl backdrop-blur-lg dark:border-dark-border dark:bg-dark-surface/95 md:block ${
          leaving
            ? "translate-y-full translate-y-full translate-y-full opacity-0 transition-all duration-300 ease-in-out"
            : "animate-slide-up"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-border dark:bg-dark-border">
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

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
              <button
                type="button"
                onClick={toggleShuffle}
                className={`rounded-full p-2 transition-all active:scale-90 ${
                  isShuffled
                    ? "bg-secondary/10 text-secondary"
                    : "text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                }`}
                aria-label="Toggle shuffle"
                title="Shuffle"
              >
                <ShuffleIcon />
              </button>
              <button
                type="button"
                onClick={prev}
                className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
                aria-label="Previous"
                title="Previous"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="rounded-full bg-gradient-to-r from-primary to-secondary p-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                aria-label={
                  isLoading ? "Loading" : isPlaying ? "Pause" : "Play"
                }
                title={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
              >
                {isLoading ? (
                  <Spinner className="h-6 w-6" />
                ) : isPlaying ? (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    className="ml-0.5 h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
                aria-label="Next"
                title="Next"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={cycleRepeat}
                className={`rounded-full p-2 transition-all active:scale-90 ${
                  repeatMode === "none"
                    ? "text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                    : "bg-secondary/10 text-secondary"
                }`}
                aria-label="Cycle repeat mode"
                title={`${repeatMode === "none" ? "Repeat" : repeatMode === "all" ? "Repeat all" : "Repeat one"}`}
              >
                <RepeatIcon mode={repeatMode} />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                className="rounded-full p-2 text-text-muted transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                aria-label="Toggle mute"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                <VolumeIcon volume={volume} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                className="h-1.5 w-20 appearance-none rounded-full bg-border dark:bg-dark-border [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                style={{
                  backgroundImage: `linear-gradient(to right, #9345f2 ${volume * 100}%, transparent ${volume * 100}%)`,
                }}
                aria-label="Volume"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={togglePlaylist}
              className="rounded-full p-2 text-text-muted transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
              aria-label="Playlist"
              title="Playlist"
            >
              <PlaylistIcon />
            </button>
            <button
              type="button"
              onClick={handleMinimize}
              className="rounded-full p-2 text-text-muted transition-all hover:bg-surface-alt active:scale-90 dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
              aria-label="Minimize"
              title="Minimize"
            >
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#2e0d8a] to-[#1a0a2e] md:hidden ${
          leaving
            ? "opacity-0 transition-all duration-300 ease-in-out"
            : "animate-fade-in"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <button
            type="button"
            onClick={togglePlaylist}
            className="rounded-full p-2 text-white/70 transition-all hover:bg-white/10 active:scale-90"
            aria-label="Playlist"
            title="Playlist"
          >
            <PlaylistIcon />
          </button>
          <h2 className="text-sm font-medium uppercase tracking-wider text-white/60">
            Now Playing
          </h2>
          <button
            type="button"
            onClick={handleMinimize}
            className="rounded-full p-2 text-white/70 transition-all hover:bg-white/10 active:scale-90"
            aria-label="Minimize"
            title="Minimize"
          >
            <ChevronDownIcon />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
          <div
            className={`flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-600 shadow-2xl ring-4 ring-white/10 ${
              isPlaying ? "animate-[spin_8s_linear_infinite]" : ""
            }`}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary">
              <div className="h-8 w-8 rounded-full bg-white/30" />
            </div>
          </div>

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
            className={`rounded-full p-3 transition-all active:scale-90 ${
              isShuffled
                ? "bg-white/10 text-secondary"
                : "text-white/60 hover:bg-white/10"
            }`}
            aria-label="Toggle shuffle"
            title="Shuffle"
          >
            <ShuffleIcon />
          </button>
          <button
            type="button"
            onClick={prev}
            className="rounded-full p-3 text-white/80 transition-all hover:bg-white/10 active:scale-90"
            aria-label="Previous"
            title="Previous"
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-full bg-white p-5 text-primary shadow-2xl transition-transform hover:scale-105 active:scale-95"
            aria-label={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
            title={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Spinner className="h-8 w-8" />
            ) : isPlaying ? (
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                className="ml-1 h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full p-3 text-white/80 transition-all hover:bg-white/10 active:scale-90"
            aria-label="Next"
            title="Next"
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={cycleRepeat}
            className={`rounded-full p-3 transition-all active:scale-90 ${
              repeatMode === "none"
                ? "text-white/60 hover:bg-white/10"
                : "bg-white/10 text-secondary"
            }`}
            aria-label="Cycle repeat mode"
            title={`${repeatMode === "none" ? "Repeat" : repeatMode === "all" ? "Repeat all" : "Repeat one"}`}
          >
            <RepeatIcon mode={repeatMode} />
          </button>
        </div>
      </div>
    </>
  );
}
