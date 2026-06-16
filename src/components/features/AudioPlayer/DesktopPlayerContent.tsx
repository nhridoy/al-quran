import {
  ChevronDownIcon,
  ListMusicIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MuteButton from "./MuteButton";
import PlayerButton from "./PlayerButton";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";
import SeekBar from "./SeekBar";
import type { DesktopPlayerContentProps } from "./types";
import VinylDisc from "./VinylDisc";

export default function DesktopPlayerContent({
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
}: Readonly<DesktopPlayerContentProps>) {
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setVolume(Number.parseFloat(e.target.value)),
    [setVolume],
  );

  return (
    <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <VinylDisc isPlaying={isPlaying} />
        <Tooltip>
          <TooltipTrigger
            render={
              <div className="min-w-0 cursor-default">
                <p className="truncate text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                  {currentTrack.enName}
                </p>
                <p className="truncate text-xs text-text-muted dark:text-dark-text-muted">
                  Ayah {currentTrack.ayahNumber}
                </p>
              </div>
            }
          />
          <TooltipContent>
            {currentTrack.enName} &mdash; Ayah {currentTrack.ayahNumber}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3">
        <SeekBar />
        <div className="flex items-center gap-1">
          <PlayerButton
            icon={<ShuffleIcon className="h-5 w-5" aria-hidden="true" />}
            label="Toggle shuffle"
            onClick={toggleShuffle}
            active={isShuffled}
          />
          <PlayerButton
            icon={<SkipBackIcon className="h-5 w-5" aria-hidden="true" />}
            label="Previous"
            onClick={prev}
            variant="secondary"
          />
          <PlayPauseButton
            isPlaying={isPlaying}
            isLoading={isLoading}
            onClick={togglePlay}
          />
          <PlayerButton
            icon={<SkipForwardIcon className="h-5 w-5" aria-hidden="true" />}
            label="Next"
            onClick={next}
            variant="secondary"
          />
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
        <PlayerButton
          icon={<ListMusicIcon className="h-5 w-5" aria-hidden="true" />}
          label="Playlist"
          onClick={togglePlaylist}
        />
        <PlayerButton
          icon={<ChevronDownIcon className="h-5 w-5" aria-hidden="true" />}
          label="Minimize"
          onClick={onMinimize}
        />
      </div>
    </div>
  );
}
