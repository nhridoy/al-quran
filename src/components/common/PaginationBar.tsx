import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-text-primary dark:hover:bg-dark-surface-alt"
      >
        <BiChevronLeft className="text-lg" />
        Previous
      </button>
      <span className="text-xs text-text-muted">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-text-primary dark:hover:bg-dark-surface-alt"
      >
        Next
        <BiChevronRight className="text-lg" />
      </button>
    </div>
  );
}
