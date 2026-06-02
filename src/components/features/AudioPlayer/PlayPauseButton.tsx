import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";

export default function PlayPauseButton({
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
