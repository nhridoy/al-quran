import { BiTrash } from "react-icons/bi";
import { FaQuran } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import type { Bookmark } from "@/store/bookmarks";
import BookmarkRow from "./BookmarkRow";

interface SurahGroupItemProps {
  items: Bookmark[];
  onClearSurah: (surahNo: number, enName: string) => void;
  onRemove: (id: string) => void;
}

export default function SurahGroupItem({
  items,
  onClearSurah,
  onRemove,
}: SurahGroupItemProps) {
  const { t } = useLocale();
  const navigate = useNavigate();
  const surahNo = items[0].surahNo;
  const enName = items[0].enName;

  return (
    <AccordionItem value={`${surahNo} - ${enName}`} className="card-surface">
      <AccordionTrigger className="flex w-full items-center gap-3 border-b border-border p-4 text-left text-sm font-medium transition-colors hover:bg-surface-alt hover:no-underline dark:border-dark-border dark:hover:bg-dark-surface-alt [&>[data-slot=accordion-trigger-icon]]:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
          <FaQuran className="text-xs text-secondary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            {enName}
          </p>
          <p className="text-xs text-text-muted dark:text-dark-text-muted">
            {t("bookmarks.surahAyahCount", { n: items.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary-ghost"
            size="icon-xs"
            className="rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/surah/${surahNo}`);
            }}
            aria-label={t("bookmarks.goToSurah")}
          >
            <IoOpenOutline className="text-xs" />
          </Button>
          <Button
            variant="danger"
            size="icon-xs"
            className="rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClearSurah(surahNo, enName);
            }}
            aria-label={t("bookmarks.clearSurahAria")}
          >
            <BiTrash className="text-xs" />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-0 pb-0">
        <div className="divide-y divide-border dark:divide-dark-border">
          {items.map((b) => (
            <BookmarkRow key={b.id} bookmark={b} onRemove={onRemove} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
