import { IoCheckmarkCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface SaveBarProps {
  hasChanges: boolean;
  onDiscard: () => void;
  saving: boolean;
  onSave: () => void;
}

export default function SaveBar({
  hasChanges,
  onDiscard,
  saving,
  onSave,
}: SaveBarProps) {
  if (!hasChanges) return null;

  return (
    <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-surface px-5 py-4 dark:border-dark-border dark:bg-dark-surface">
      <Button
        onClick={onDiscard}
        variant="secondary-ghost"
        className="rounded-xl px-5 py-2 text-sm font-semibold text-white hover:text-text-muted"
      >
        Discard
      </Button>
      <Button
        onClick={onSave}
        disabled={saving}
        variant="gradient"
        className="rounded-xl px-5 py-2 text-sm font-semibold"
      >
        <IoCheckmarkCircle className="text-base" />
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
