import { memo } from "react";
import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@/i18n";
import type { Bookmark } from "@/store/bookmarks";
import { useSettings } from "@/store/settings";

interface BookmarkRowProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
}

const BookmarkRow = memo(function BookmarkRow({
  bookmark,
  onRemove,
}: BookmarkRowProps) {
  const { t } = useLocale();
  const translationLang = useSettings((s) => s.translationLang);
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
        {translationLang === "bn"
          ? bnText && (
              <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {bnText}
              </p>
            )
          : enText && (
              <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {enText}
              </p>
            )}
        <p className="mt-1 text-xs text-text-muted">
          {t("bookmarks.ayahLabel", { n: ayahNo })}
        </p>
      </button>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="danger"
              size="icon"
              className="rounded-lg"
              onClick={() => onRemove(id)}
              aria-label={t("bookmarks.removeBookmark")}
            >
              <BiTrash className="text-sm" />
            </Button>
          }
        />
        <TooltipContent>{t("bookmarks.removeBookmark")}</TooltipContent>
      </Tooltip>
    </div>
  );
});

export default BookmarkRow;
