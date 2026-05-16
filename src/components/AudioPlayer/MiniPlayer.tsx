import { useEffect, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <title>Loading</title>
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

export default function MiniPlayer() {
  const [entering, setEntering] = useState(true);
  const {
    currentTrack,
    isExpanded,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    expand,
    togglePlay,
  } = useAudioPlayer();

  useEffect(() => {
    if (entering) {
      const timer = setTimeout(() => setEntering(false), 50);
      return () => clearTimeout(timer);
    }
  }, [entering]);

  if (!currentTrack) return null;

  const hidden = isExpanded || entering;
  const progress = duration > 0 ? currentTime / duration : 0;
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  return (
    <div
      className={`fixed bottom-24 right-5 z-50 origin-center transition-all duration-300 ease-out md:bottom-6 ${
        hidden
          ? "pointer-events-none scale-75 translate-y-4 opacity-0"
          : "pointer-events-auto scale-100 translate-y-0 opacity-100"
      }`}
    >
      <div className="relative h-16 w-16">
        <button
          type="button"
          onClick={expand}
          className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary shadow-2xl shadow-primary/40 transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="Expand player"
          title="Expand"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <title>Playback progress</title>
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute inset-0 z-10 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <Spinner />
          ) : isPlaying ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <title>Pause</title>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              className="ml-0.5 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <title>Play</title>
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
