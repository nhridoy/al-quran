import { memo } from "react";

interface PlayerButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: "muted" | "secondary";
}

const PlayerButton = memo(function PlayerButton({
  icon,
  label,
  onClick,
  active = false,
  variant = "muted",
}: PlayerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full p-2 transition-all active:scale-90 ${
        active
          ? "bg-secondary/10 text-secondary"
          : variant === "secondary"
            ? "text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            : "text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
      }`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
});

export default PlayerButton;
