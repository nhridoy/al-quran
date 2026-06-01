import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAudioProgressStore } from "@/store/audio";
import {
  useAudioPlayerActions,
  useAudioPlayerState,
} from "./AudioPlayerContext";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MiniPlayer() {
  const [entering, setEntering] = useState(true);
  const { currentTrack, isExpanded, isPlaying, isLoading } =
    useAudioPlayerState();
  const { expand, togglePlay } = useAudioPlayerActions();
  const currentTime = useAudioProgressStore((s) => s.currentTime);
  const duration = useAudioProgressStore((s) => s.duration);

  const handleTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      togglePlay();
    },
    [togglePlay],
  );

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
          className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary shadow-2xl shadow-primary/40 transition-transform duration-200 hover:scale-105 active:scale-95"
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
          onClick={handleTogglePlay}
          className="absolute inset-0 z-10 m-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <Loader2Icon className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : isPlaying ? (
            <PauseIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PlayIcon className="ml-0.5 h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
