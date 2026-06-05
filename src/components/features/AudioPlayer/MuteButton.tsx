import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { memo } from "react";
import PlayerButton from "./PlayerButton";

const MuteButton = memo(function MuteButton({
  volume,
  onToggle,
}: {
  volume: number;
  onToggle: () => void;
}) {
  return (
    <PlayerButton
      icon={
        volume === 0 ? (
          <VolumeXIcon className="h-5 w-5" aria-hidden="true" />
        ) : volume < 0.5 ? (
          <Volume1Icon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Volume2Icon className="h-5 w-5" aria-hidden="true" />
        )
      }
      label={volume === 0 ? "Unmute" : "Mute"}
      onClick={onToggle}
    />
  );
});

export default MuteButton;
