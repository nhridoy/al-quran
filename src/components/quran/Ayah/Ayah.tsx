import { memo, useMemo } from "react";
import { BiBookmark, BiShareAlt } from "react-icons/bi";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import type { Track } from "@/components/features/AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAyahAudio } from "@/hooks/useAyahAudio";
import { useAyahBookmark } from "@/hooks/useAyahBookmark";
import { useScrollToCurrentAyah } from "@/hooks/useScrollToCurrentAyah";
import { useShareAyah } from "@/hooks/useShareAyah";
import { useVerseTafsir } from "@/hooks/useVerseTafsir";
import { colorizeArabic } from "@/lib/tajweed";
import { useSettings } from "@/store/settings";
import type { SurahData, Verse } from "@/types";
import AyahTafsir from "./AyahTafsir";

interface AyahsProps {
  ayah: Verse;
  surah?: SurahData;
  tracklist?: Track[];
  surahNo?: number;
}

const Ayahs = memo(({ ayah, surah, tracklist, surahNo }: AyahsProps) => {
  const tajweedEnabled = useSettings((s) => s.tajweedEnabled);
  const tafsirEnabled = useSettings((s) => s.tafsirEnabled);
  const tafsirId = useSettings((s) => s.tafsirId);
  const translationLang = useSettings((s) => s.translationLang);
  const currentSurahNo = surah?.no ?? surahNo ?? 0;

  const { isCurrentAyah, isThisAyahPlaying, handlePlay } = useAyahAudio(
    ayah,
    surah,
    tracklist,
    surahNo,
  );
  const { isBookmarked, handleToggleBookmark } = useAyahBookmark(
    ayah,
    surah,
    surahNo,
  );
  const { handleShare } = useShareAyah(ayah, surah);
  const { data: verseTafsir, loading: tafsirLoading } = useVerseTafsir(
    tafsirEnabled ? tafsirId : undefined,
    currentSurahNo,
    ayah.numberInSurah,
  );

  useScrollToCurrentAyah(isCurrentAyah, ayah.totalNumber);

  const coloredSegments = useMemo(() => {
    if (!tajweedEnabled) return null;
    const segments = colorizeArabic(ayah.text.arText);
    let offset = 0;
    return segments.map((seg) => {
      const key = `${ayah.totalNumber}-off-${offset}`;
      offset += seg.text.length;
      return { ...seg, _key: key };
    });
  }, [tajweedEnabled, ayah.text.arText, ayah.totalNumber]);

  return (
    <div
      id={`ayah-${ayah.totalNumber}`}
      className={`rounded-2xl border transition-all duration-300 ${
        isCurrentAyah
          ? "border-accent/30 bg-accent-soft/50 shadow-lg shadow-accent/5 dark:border-accent/20 dark:bg-accent/5"
          : "border-transparent bg-surface dark:bg-dark-surface-card"
      }`}
    >
      <div className="p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${
                isCurrentAyah
                  ? "bg-linear-to-br from-primary to-secondary text-white"
                  : "bg-surface-alt text-text-secondary dark:bg-dark-surface-alt dark:text-dark-text-secondary"
              }`}
            >
              {ayah.numberInSurah}
            </span>
            {ayah.sajda.recommended && (
              <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent dark:bg-accent/10">
                Sajdah
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="secondary-ghost"
                    size="icon"
                    className="rounded-lg"
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <BiShareAlt className="text-base" />
                  </Button>
                }
              />
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={isThisAyahPlaying ? "gradient" : "secondary-ghost"}
                    size="icon"
                    className={`rounded-lg ${isThisAyahPlaying ? "shadow-md" : ""}`}
                    onClick={handlePlay}
                    aria-label={isThisAyahPlaying ? "Pause" : "Play"}
                  >
                    {isThisAyahPlaying ? (
                      <IoPauseOutline className="text-base" />
                    ) : (
                      <IoPlayOutline className="text-base" />
                    )}
                  </Button>
                }
              />
              <TooltipContent>
                {isThisAyahPlaying
                  ? "Pause"
                  : `Play ayah ${ayah.numberInSurah}`}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={isBookmarked ? "gradient" : "secondary-ghost"}
                    size="icon"
                    className={`rounded-lg ${
                      isBookmarked
                        ? "from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-secondary dark:text-secondary-light"
                        : ""
                    }`}
                    onClick={handleToggleBookmark}
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  >
                    <BiBookmark
                      className={`text-base ${isBookmarked ? "fill-current" : ""}`}
                    />
                  </Button>
                }
              />
              <TooltipContent>
                {isBookmarked ? "Remove bookmark" : "Bookmark"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {coloredSegments ? (
          <p className="font-arabic mb-3 text-right text-2xl leading-loose md:text-3xl">
            {coloredSegments.map((seg) => (
              <span
                key={seg._key}
                className={
                  seg.color
                    ? `tajweed-${seg.color}`
                    : "text-text-primary dark:text-dark-text-primary"
                }
              >
                {seg.text}
              </span>
            ))}
          </p>
        ) : (
          <p className="font-arabic mb-3 text-right text-2xl leading-loose text-text-primary dark:text-dark-text-primary md:text-3xl">
            {ayah.text.arText}
          </p>
        )}

        <p className="mb-2 text-right text-sm italic text-text-muted dark:text-dark-text-muted">
          {ayah.text.enTextTransliteration}
        </p>

        <div className="space-y-1.5 border-t border-border pt-3 dark:border-dark-border">
          <p className="text-sm leading-relaxed text-text-primary dark:text-dark-text-primary">
            {translationLang === "bn" ? ayah.text.bnText : ayah.text.enText}
          </p>
        </div>

        {tafsirEnabled && (
          <AyahTafsir loading={tafsirLoading} data={verseTafsir} />
        )}
      </div>
    </div>
  );
});

export default Ayahs;
