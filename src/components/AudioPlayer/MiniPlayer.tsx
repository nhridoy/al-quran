import { useAudioPlayer } from "./AudioPlayerContext";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MiniPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, expand, togglePlay } =
    useAudioPlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? currentTime / duration : 0;
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="relative w-16 h-16">
        <button
          type="button"
          onClick={expand}
          className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
          aria-label="Expand player"
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
          className="absolute inset-0 m-auto w-10 h-10 z-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors cursor-pointer"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
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
