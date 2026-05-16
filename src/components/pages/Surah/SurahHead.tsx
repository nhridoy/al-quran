import type React from "react";
import {
  CgPlayTrackNextO,
  CgPlayTrackPrevO,
  CgSpinnerTwo,
} from "react-icons/cg";
import { FiPauseCircle, FiPlayCircle } from "react-icons/fi";
import {
  buildPlaylistFromSurah,
  useAudioPlayer,
} from "../../../components/AudioPlayer";
import type { SurahData } from "../../../types";

interface SurahHeadProps {
  surah: SurahData;
}

export const SurahHead: React.FC<SurahHeadProps> = ({ surah }) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    togglePlay,
    setPlaylist,
    prev,
    next,
  } = useAudioPlayer();

  const isCurrentSurah = currentTrack?.surahNo === surah.no;

  const handlePlay = () => {
    if (isCurrentSurah) {
      togglePlay();
    } else {
      const tracks = buildPlaylistFromSurah(surah);
      setPlaylist(tracks, 0);
    }
  };

  const handlePrev = () => {
    if (isCurrentSurah) {
      prev();
    } else {
      const tracks = buildPlaylistFromSurah(surah);
      setPlaylist(tracks, 0);
    }
  };

  const handleNext = () => {
    if (isCurrentSurah) {
      next();
    } else {
      const tracks = buildPlaylistFromSurah(surah);
      setPlaylist(tracks, 0);
    }
  };

  return (
    <div className="relative mx-4 mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary-light to-secondary p-6 text-white shadow-xl shadow-primary/20 md:mx-6 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{surah.name}</h2>
            <span className="text-white/60">|</span>
            <h2 className="text-xl font-semibold text-white/90">
              {surah.bnNameTranslation}
            </h2>
          </div>
          <h2 className="text-lg font-semibold text-white/80">
            {surah.enName} &mdash; {surah.enNameTranslation}
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs font-medium uppercase text-white/60">
            <span>
              {surah.revelationType === "Meccan" ? "Makkah" : "Madinah"}
            </span>
            <span>&bull;</span>
            <span>{surah.numberOfAyahs} verses</span>
          </div>
        </div>

        <div className="hidden flex-col items-center md:flex">
          <p className="mb-2 font-arabic text-2xl text-gold-light">
            بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 active:scale-90"
            aria-label="Previous"
          >
            <CgPlayTrackPrevO className="text-xl" />
          </button>
          <button
            type="button"
            onClick={handlePlay}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-primary shadow-lg transition-all hover:scale-105 active:scale-95"
            aria-label={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <CgSpinnerTwo className="animate-spin text-xl" />
            ) : isPlaying ? (
              <FiPauseCircle className="text-2xl" />
            ) : (
              <FiPlayCircle className="text-2xl" />
            )}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 active:scale-90"
            aria-label="Next"
          >
            <CgPlayTrackNextO className="text-xl" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-center md:hidden">
        <p className="font-arabic text-lg text-gold-light">
          بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ
        </p>
      </div>
    </div>
  );
};
