import { memo } from "react";
import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/store/bookmarks";

interface BookmarkRowProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
}

const BookmarkRow = memo(function BookmarkRow({
  bookmark,
  onRemove,
}: BookmarkRowProps) {
  const navigate = useNavigate();
  const { id, surahNo, ayahNo, arabicText, enText, bnText } = bookmark;

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <button
        type="button"
        onClick={() =>
          navigate(
            ayahNo ? `/surah/${surahNo}?ayah=${ayahNo}` : `/surah/${surahNo}`,
          )
        }
        className="flex-1 cursor-pointer text-left"
      >
        <p className="font-arabic text-right text-lg leading-relaxed text-text-primary dark:text-dark-text-primary">
          {arabicText}
        </p>
        {enText && (
          <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            {enText}
          </p>
        )}
        {bnText && (
          <p className="text-[11px] leading-relaxed text-text-muted dark:text-dark-text-muted">
            {bnText}
          </p>
        )}
        <p className="mt-1 text-xs text-text-muted">Ayah {ayahNo}</p>
      </button>
      <Button
        variant="danger"
        size="icon"
        className="rounded-lg"
        onClick={() => onRemove(id)}
        aria-label="Remove bookmark"
      >
        <BiTrash className="text-sm" />
      </Button>
    </div>
  );
});

export default BookmarkRow;
