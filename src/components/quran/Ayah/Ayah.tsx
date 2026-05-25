import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BiBook, BiBookmark, BiShareAlt } from "react-icons/bi";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import { useVerseTafsir } from "../../../hooks/useVerseTafsir";
import { getAudioData, mergeAudioWithSurah } from "../../../lib/db";
import { colorizeArabic } from "../../../lib/tajweed";
import { useBookmarkStore } from "../../../store/bookmarks";
import { useSettings } from "../../../store/settings";
import type { Verse } from "../../../types";
import type { Track } from "../../features/AudioPlayer";
import {
  buildPlaylistFromSurah,
  useAudioPlayer,
} from "../../features/AudioPlayer";

interface AyahsProps {
  ayah: Verse;
  surah?: { no: number; name: string; enName: string; verses?: Verse[] };
  tracklist?: Track[];
  surahNo?: number;
}

const Ayahs: React.FC<AyahsProps> = ({ ayah, surah, tracklist, surahNo }) => {
  const { currentTrack, isPlaying, togglePlay, setPlaylist } = useAudioPlayer();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const addBookmark = useBookmarkStore((s) => s.add);
  const removeBookmark = useBookmarkStore((s) => s.remove);
  const reciterId = useSettings((s) => s.reciterId);
  const tajweedEnabled = useSettings((s) => s.tajweedEnabled);
  const tafsirEnabled = useSettings((s) => s.tafsirEnabled);
  const tafsirId = useSettings((s) => s.tafsirId);
  const audioPromiseRef = useRef<Promise<Track[]> | null>(null);
  const [tafsirOpen, setTafsirOpen] = useState(false);
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
  const isBookmarked = bookmarks.some((b) => b.id === ayahId);

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
    if (!surah?.verses) return;
    const idx = ayah.numberInSurah - 1;
    if (!audioPromiseRef.current) {
      audioPromiseRef.current = (async () => {
        const audioUrls = await getAudioData(reciterId, surah.no);
        if (audioUrls.length === 0) return [];
        const merged = await mergeAudioWithSurah(
          surah as {
            no: number;
            name: string;
            enName: string;
            verses: Verse[];
          },
          audioUrls,
        );
        return buildPlaylistFromSurah(merged);
      })();
    }
    audioPromiseRef.current.then((tracks) => {
      setPlaylist(tracks, idx);
    });
  }, [
    isCurrentAyah,
    togglePlay,
    tracklist,
    surahNo,
    ayah,
    surah,
    setPlaylist,
    reciterId,
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
            <button
              type="button"
              onClick={handleShare}
              className="btn-ghost flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
              aria-label="Share"
              title="Share"
            >
              <BiShareAlt className="text-base" />
            </button>
            <button
              type="button"
              onClick={handlePlay}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all active:scale-90 ${
                isThisAyahPlaying
                  ? "bg-linear-to-br from-primary to-secondary text-white shadow-md"
                  : "btn-ghost"
              }`}
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
            </button>
            <button
              type="button"
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
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all active:scale-90 ${
                isBookmarked
                  ? "bg-linear-to-br from-primary/10 to-secondary/10 text-secondary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light"
                  : "btn-ghost"
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <BiBookmark
                className={`text-base ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
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
          <>
            <button
              type="button"
              onClick={() => setTafsirOpen((v) => !v)}
              className="mt-2 flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-surface-alt/50 px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-surface-alt dark:border-dark-border dark:bg-dark-surface-alt/50 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              <span className="flex items-center gap-1.5">
                <BiBook className="text-sm" />
                {tafsirOpen ? "Hide Tafsir" : "Show Tafsir"}
              </span>
              <svg
                className={`h-3.5 w-3.5 transition-transform ${tafsirOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {tafsirOpen && (
              <div className="mt-1 overflow-hidden rounded-xl border border-border bg-surface-alt/30 dark:border-dark-border dark:bg-dark-surface-alt/30">
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
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: tafsir content from trusted API
                      dangerouslySetInnerHTML={{ __html: verseTafsir.text }}
                    />
                  </div>
                ) : (
                  <p className="p-3 text-xs text-text-muted dark:text-dark-text-muted">
                    Tafsir not available for this verse
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Ayahs;
