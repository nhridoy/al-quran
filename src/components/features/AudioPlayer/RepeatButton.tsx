import { Repeat1Icon, RepeatIcon as RepeatIconLucide } from "lucide-react";
import { memo } from "react";
import PlayerButton from "./PlayerButton";

const RepeatButton = memo(function RepeatButton({
  mode,
  onClick,
}: {
  mode: "none" | "all" | "one";
  onClick: () => void;
}) {
  return (
    <PlayerButton
      icon={
        mode === "one" ? (
          <Repeat1Icon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <RepeatIconLucide className="h-5 w-5" aria-hidden="true" />
        )
      }
      label={
        mode === "none"
          ? "Repeat"
          : mode === "all"
            ? "Repeat all"
            : "Repeat one"
      }
      onClick={onClick}
      active={mode !== "none"}
    />
  );
});

export default RepeatButton;
