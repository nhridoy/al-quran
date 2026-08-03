import { memo } from "react";
import type { VerseResult } from "@/lib/search";
import { useSettings } from "@/store/settings";

interface VerseResultItemProps {
  result: VerseResult;
  onClick: (surahNo: number, ayahNo?: number) => void;
}

const VerseResultItem = memo(function VerseResultItem({
  result,
  onClick,
}: VerseResultItemProps) {
  const translationLang = useSettings((s) => s.translationLang);
  return (
    <button
      type="button"
      onClick={() => onClick(result.surahNo, result.verse.numberInSurah)}
      className="w-full cursor-pointer rounded-xl p-3 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
    >
      <p className="font-arabic text-right text-lg leading-relaxed text-text-primary dark:text-dark-text-primary">
        {result.verse.text.arText}
      </p>
      <p className="mt-1 text-xs italic text-text-muted dark:text-dark-text-muted line-clamp-1">
        {translationLang === "bn"
          ? result.verse.text.bnText
          : result.verse.text.enText}
      </p>
      <p className="mt-1 text-[11px] font-medium text-secondary dark:text-secondary-light">
        {result.enName} &mdash; Ayah {result.verse.numberInSurah}
      </p>
    </button>
  );
});

export default VerseResultItem;
