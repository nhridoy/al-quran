import DOMPurify from "dompurify";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { BiBook, BiBookmark, BiShareAlt } from "react-icons/bi";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSurahAudio } from "@/hooks/useSurahAudio";
import { useVerseTafsir } from "@/hooks/useVerseTafsir";
import { colorizeArabic } from "@/lib/tajweed";
import { useBookmarkStore, useIsBookmarked } from "@/store/bookmarks";
import { useSettings } from "@/store/settings";
import type { SurahData, Verse } from "@/types";
import type { Track } from "../../features/AudioPlayer";
import {
  useAudioPlayerActions,
  useAudioPlayerState,
} from "../../features/AudioPlayer";

interface AyahsProps {
  ayah: Verse;
  surah?: SurahData;
  tracklist?: Track[];
  surahNo?: number;
}

const Ayahs = memo(({ ayah, surah, tracklist, surahNo }: AyahsProps) => {
  const { currentTrack, isPlaying } = useAudioPlayerState();
  const { togglePlay, setPlaylist } = useAudioPlayerActions();
  const addBookmark = useBookmarkStore((s) => s.add);
  const removeBookmark = useBookmarkStore((s) => s.remove);
  const tajweedEnabled = useSettings((s) => s.tajweedEnabled);
  const tafsirEnabled = useSettings((s) => s.tafsirEnabled);
  const tafsirId = useSettings((s) => s.tafsirId);
  const { fetchAudio } = useSurahAudio(surah);
  const audioPromiseRef = useRef<Promise<Track[]> | null>(null);
  const currentSurahNo = surah?.no ?? surahNo ?? 0;
  const { data: verseTafsir, loading: tafsirLoading } = useVerseTafsir(
    tafsirEnabled ? tafsirId : undefined,
    currentSurahNo,
    ayah.numberInSurah,
  );

  const coloredSegments = useMemo(
    () => (tajweedEnabled ? colorizeArabic(ayah.text.arText) : null),
    [tajweedEnabled, ayah.text.arText],
  );

  const isCurrentAyah = currentTrack?.totalNumber === ayah.totalNumber;
  const isThisAyahPlaying = isCurrentAyah && isPlaying;

  const ayahId = `${surah?.no || currentSurahNo}-${ayah.numberInSurah}`;
  const isBookmarked = useIsBookmarked(ayahId);

  useEffect(() => {
    if (isCurrentAyah) {
      document
        .getElementById(`ayah-${ayah.totalNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrentAyah, ayah.totalNumber]);

  const handleShare = useCallback(() => {
    const text = `${ayah.text.arText}\n\n${ayah.text.enText}\n${ayah.text.enTextTransliteration}\n\n— ${surah?.enName || ""} ${ayah.numberInSurah}`;
    if (navigator.share) {
      navigator.share({ title: "Al Quran", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [ayah, surah]);

  const handlePlay = useCallback(() => {
    if (isCurrentAyah) {
      togglePlay();
      return;
    }
    if (tracklist && surahNo !== undefined) {
      const idx = tracklist.findIndex(
        (t) => t.surahNo === surahNo && t.ayahNumber === ayah.numberInSurah,
      );
      setPlaylist(tracklist, Math.max(idx, 0));
      return;
    }
    if (!surah) return;
    const idx = ayah.numberInSurah - 1;
    audioPromiseRef.current ??= fetchAudio();
    audioPromiseRef.current.then((tracks) => {
      if (tracks.length > 0) setPlaylist(tracks, idx);
    });
  }, [
    isCurrentAyah,
    togglePlay,
    tracklist,
    surahNo,
    ayah,
    surah,
    setPlaylist,
    fetchAudio,
  ]);

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
            <Button
              variant="secondary-ghost"
              size="icon"
              className="rounded-lg"
              onClick={handleShare}
              aria-label="Share"
              title="Share"
            >
              <BiShareAlt className="text-base" />
            </Button>
            <Button
              variant={isThisAyahPlaying ? "gradient" : "secondary-ghost"}
              size="icon"
              className={`rounded-lg ${isThisAyahPlaying ? "shadow-md" : ""}`}
              onClick={handlePlay}
              aria-label={isThisAyahPlaying ? "Pause" : "Play"}
              title={
                isThisAyahPlaying ? "Pause" : `Play ayah ${ayah.numberInSurah}`
              }
            >
              {isThisAyahPlaying ? (
                <IoPauseOutline className="text-base" />
              ) : (
                <IoPlayOutline className="text-base" />
              )}
            </Button>
            <Button
              variant={isBookmarked ? "gradient" : "secondary-ghost"}
              size="icon"
              className={`rounded-lg ${
                isBookmarked
                  ? "from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-secondary dark:text-secondary-light"
                  : ""
              }`}
              onClick={() => {
                if (isBookmarked) {
                  removeBookmark(ayahId);
                } else if (surah || surahNo) {
                  addBookmark({
                    id: ayahId,
                    surahNo: surah?.no ?? surahNo ?? 0,
                    ayahNo: ayah.numberInSurah,
                    surahName: surah?.name || "",
                    enName: surah?.enName || "",
                    arabicText: ayah.text.arText,
                    enText: ayah.text.enText,
                    bnText: ayah.text.bnText,
                  });
                }
              }}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <BiBookmark
                className={`text-base ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>

        {coloredSegments ? (
          <p className="font-arabic mb-3 text-right text-2xl leading-loose md:text-3xl">
            {coloredSegments.map((seg) => (
              <span
                key={`${seg.text}-${seg.color ?? "none"}`}
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
            {ayah.text.enText}
          </p>
          <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            {ayah.text.bnText}
          </p>
        </div>

        {tafsirEnabled && (
          <Accordion className="mt-2">
            <AccordionItem value="tafsir" className="border-0">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-xl border border-border bg-surface-alt/50 px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-surface-alt hover:no-underline dark:border-dark-border dark:bg-dark-surface-alt/50 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt">
                <span className="flex items-center gap-1.5">
                  <BiBook className="text-sm" />
                  Show Tafsir
                </span>
              </AccordionTrigger>
              <AccordionContent className="mt-1 overflow-hidden rounded-xl border border-border bg-surface-alt/30 dark:border-dark-border dark:bg-dark-surface-alt/30">
                {tafsirLoading ? (
                  <div className="space-y-2 p-3">
                    <div
                      className="h-3 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                      style={{ width: "80%" }}
                    />
                    <div
                      className="h-3 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                      style={{ width: "60%" }}
                    />
                    <div
                      className="h-3 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                      style={{ width: "70%" }}
                    />
                  </div>
                ) : verseTafsir ? (
                  <div className="prose-sm prose max-w-none p-3 text-sm leading-relaxed text-text-secondary dark:prose-invert dark:text-dark-text-secondary">
                    <div
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized via DOMPurify
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(verseTafsir.text),
                      }}
                    />
                  </div>
                ) : (
                  <p className="p-3 text-xs text-text-muted dark:text-dark-text-muted">
                    Tafsir not available for this verse
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
});

export default Ayahs;
