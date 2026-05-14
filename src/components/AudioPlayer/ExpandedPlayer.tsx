import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

function RepeatIcon({ mode }: { mode: "none" | "all" | "one" }) {
  return (
    <svg
      className="w-5 h-5"
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
      className="w-5 h-5"
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
      className="w-5 h-5"
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

function ChevronDownIcon() {
  return (
    <svg
      className="w-5 h-5"
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

function VolumeIcon({ volume }: { volume: number }) {
  return (
    <svg
      className="w-5 h-5"
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
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-md border-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}

function VinylDisc({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-lg ${
          isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
    </div>
  );
}

export default function ExpandedPlayer() {
  const [leaving, setLeaving] = useState(false);
  const {
    isExpanded,
    isPlaying,
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
        className={`hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1f24]/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-2xl ${
          leaving
            ? "transition-all duration-300 ease-in-out translate-y-full opacity-0"
            : "animate-[slideUp_0.3s_ease-out]"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4 px-4 h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <VinylDisc isPlaying={isPlaying} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentTrack.enName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Ayah {currentTrack.ayahNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-center">
            <SeekBar />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled
                    ? "text-secondary bg-secondary/10"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Toggle shuffle"
              >
                <ShuffleIcon />
              </button>
              <button
                type="button"
                onClick={prev}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Previous"
              >
                <svg
                  className="w-5 h-5"
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
                className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 ml-0.5"
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
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Next"
              >
                <svg
                  className="w-5 h-5"
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
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== "none"
                    ? "text-secondary bg-secondary/10"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Cycle repeat mode"
              >
                <RepeatIcon mode={repeatMode} />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle mute"
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
                className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-secondary
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:shadow-md"
                aria-label="Volume"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={togglePlaylist}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Playlist"
            >
              <PlaylistIcon />
            </button>
            <button
              type="button"
              onClick={handleMinimize}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Minimize"
            >
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-50 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col ${
          leaving
            ? "transition-all duration-300 ease-in-out opacity-0"
            : "animate-[fadeIn_0.2s_ease-out]"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <button
            type="button"
            onClick={togglePlaylist}
            className="p-2 rounded-full text-white/70 hover:bg-white/10 transition-colors"
            aria-label="Playlist"
          >
            <PlaylistIcon />
          </button>
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Now Playing
          </h2>
          <button
            type="button"
            onClick={minimize}
            className="p-2 rounded-full text-white/70 hover:bg-white/10 transition-colors"
            aria-label="Minimize"
          >
            <ChevronDownIcon />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          <div
            className={`w-64 h-64 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 border-4 border-white/10 shadow-2xl flex items-center justify-center ${
              isPlaying ? "animate-[spin_8s_linear_infinite]" : ""
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/30" />
            </div>
          </div>

          <div className="text-center w-full max-w-sm">
            <p className="text-2xl font-bold text-white mb-1">
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
            className={`p-3 rounded-full transition-colors ${
              isShuffled
                ? "text-secondary bg-white/10"
                : "text-white/60 hover:bg-white/10"
            }`}
            aria-label="Toggle shuffle"
          >
            <ShuffleIcon />
          </button>
          <button
            type="button"
            onClick={prev}
            className="p-3 rounded-full text-white/80 hover:bg-white/10 transition-colors"
            aria-label="Previous"
          >
            <svg
              className="w-8 h-8"
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
            className="p-5 rounded-full bg-white text-primary shadow-2xl hover:scale-105 active:scale-95 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 ml-1"
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
            className="p-3 rounded-full text-white/80 hover:bg-white/10 transition-colors"
            aria-label="Next"
          >
            <svg
              className="w-8 h-8"
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
            className={`p-3 rounded-full transition-colors ${
              repeatMode !== "none"
                ? "text-secondary bg-white/10"
                : "text-white/60 hover:bg-white/10"
            }`}
            aria-label="Cycle repeat mode"
          >
            <RepeatIcon mode={repeatMode} />
          </button>
        </div>
      </div>
    </>
  );
}
