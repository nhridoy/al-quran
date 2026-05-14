import { useEffect, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
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
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out origin-center ${
        hidden
          ? "opacity-0 scale-75 translate-y-4 pointer-events-none"
          : "opacity-100 scale-100 translate-y-0 pointer-events-auto"
      }`}
    >
      <div className="relative w-16 h-16">
        <button
          type="button"
          onClick={expand}
          className="flex items-center justify-center w-full h-full transition-transform duration-200 rounded-full shadow-2xl cursor-pointer bg-linear-to-br from-primary to-secondary shadow-primary/40 hover:scale-105 active:scale-95"
          aria-label="Expand player"
          title="Expand"
        >
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
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
          className="absolute inset-0 z-10 flex items-center justify-center w-10 h-10 m-auto text-white transition-colors rounded-full cursor-pointer bg-white/20 backdrop-blur-sm hover:bg-white/30"
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <Spinner />
          ) : isPlaying ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <title>Pause</title>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 ml-0.5"
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
