import type React from "react";
import { useCallback, useEffect } from "react";
import { BiBookmark, BiShareAlt } from "react-icons/bi";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import type { Track } from "../../../components/AudioPlayer";
import {
  buildPlaylistFromSurah,
  useAudioPlayer,
} from "../../../components/AudioPlayer";
import type { SurahData, Verse } from "../../../types";

interface AyahsProps {
  ayah: Verse;
  surah?: SurahData;
  tracklist?: Track[];
  surahNo?: number;
}

const Ayahs: React.FC<AyahsProps> = ({ ayah, surah, tracklist, surahNo }) => {
  const { currentTrack, isPlaying, togglePlay, setPlaylist } = useAudioPlayer();

  const isCurrentAyah = currentTrack?.totalNumber === ayah.totalNumber;
  const isThisAyahPlaying = isCurrentAyah && isPlaying;

  useEffect(() => {
    if (isCurrentAyah) {
      document
        .getElementById(`ayah-${ayah.totalNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrentAyah, ayah.totalNumber]);

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
    const tracks = buildPlaylistFromSurah(surah);
    setPlaylist(tracks, idx);
  }, [isCurrentAyah, togglePlay, tracklist, surahNo, ayah, surah, setPlaylist]);

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
              className="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg"
              aria-label="Share"
              title="Share"
            >
              <BiShareAlt className="text-base" />
            </button>
            <button
              type="button"
              onClick={handlePlay}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90 ${
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
              className="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg"
              aria-label="Bookmark"
              title="Bookmark"
            >
              <BiBookmark className="text-base" />
            </button>
          </div>
        </div>

        <p className="font-arabic mb-3 text-right text-2xl leading-loose text-text-primary dark:text-dark-text-primary md:text-3xl">
          {ayah.text}
        </p>

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
