import type React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { BiBookmark, BiShareAlt } from "react-icons/bi";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import type { Track } from "../../../components/AudioPlayer";
import {
  buildPlaylistFromSurah,
  useAudioPlayer,
} from "../../../components/AudioPlayer";
import { QARIS } from "../../../data/qaris";
import { colorizeArabic } from "../../../lib/tajweed";
import { useBookmarkStore } from "../../../store/bookmarks";
import { useSettings } from "../../../store/settings";
import type { Verse } from "../../../types";

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
  const qariId = useSettings((s) => s.qariId);
  const qariBase = QARIS.find((q) => q.id === qariId)?.baseUrl;
  const tajweedEnabled = useSettings((s) => s.tajweedEnabled);

  const coloredSegments = useMemo(
    () => (tajweedEnabled ? colorizeArabic(ayah.text) : null),
    [tajweedEnabled, ayah.text],
  );

  const isCurrentAyah = currentTrack?.totalNumber === ayah.totalNumber;
  const isThisAyahPlaying = isCurrentAyah && isPlaying;

  const ayahId = `${surah?.no || surahNo}-${ayah.numberInSurah}`;
  const isBookmarked = bookmarks.some((b) => b.id === ayahId);

  useEffect(() => {
    if (isCurrentAyah) {
      document
        .getElementById(`ayah-${ayah.totalNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrentAyah, ayah.totalNumber]);

  const handleShare = useCallback(() => {
    const text = `${ayah.text}\n\n${ayah.enText}\n${ayah.enTextTransliteration}\n\n— ${surah?.enName || ""} ${ayah.numberInSurah}`;
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
    const tracks = buildPlaylistFromSurah(
      surah as Parameters<typeof buildPlaylistFromSurah>[0],
      qariBase,
    );
    setPlaylist(tracks, idx);
  }, [
    isCurrentAyah,
    togglePlay,
    tracklist,
    surahNo,
    ayah,
    surah,
    setPlaylist,
    qariBase,
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
                    arabicText: ayah.text,
                    enText: ayah.enText,
                    bnText: ayah.bnText,
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
            {ayah.text}
          </p>
        )}

        <p className="mb-2 text-right text-sm italic text-text-muted dark:text-dark-text-muted">
          {ayah.enTextTransliteration}
        </p>

        <div className="space-y-1.5 border-t border-border pt-3 dark:border-dark-border">
          <p className="text-sm leading-relaxed text-text-primary dark:text-dark-text-primary">
            {ayah.enText}
          </p>
          <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            {ayah.bnText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ayahs;
