import type React from "react";
import { BiBookmark, BiPause, BiPlay, BiShareAlt } from "react-icons/bi";
import {
  buildPlaylistFromSurah,
  useAudioPlayer,
} from "../../../components/AudioPlayer";
import type { SurahData, Verse } from "../../../types";

interface AyahsProps {
  ayah: Verse;
  surah?: SurahData;
}

const Ayahs: React.FC<AyahsProps> = ({ ayah, surah }) => {
  const { currentTrack, isPlaying, togglePlay, setPlaylist } = useAudioPlayer();

  const isCurrentAyah = currentTrack?.totalNumber === ayah.totalNumber;
  const isThisAyahPlaying = isCurrentAyah && isPlaying;

  const handlePlay = () => {
    if (!surah) return;
    if (isCurrentAyah) {
      togglePlay();
      return;
    }
    const idx = ayah.numberInSurah - 1;
    const tracks = buildPlaylistFromSurah(surah);
    setPlaylist(tracks, idx);
  };

  return (
    <div
      id={`ayah-${ayah.totalNumber}`}
      className="flex flex-col gap-4 p-4 border-b-2 rounded-lg"
    >
      <div className="flex bg-secondaryLight dark:bg-[#191f24] p-3 rounded-lg justify-between items-center">
        <button
          type="button"
          onClick={handlePlay}
          className={`w-10 h-10 rounded-full font-semibold flex justify-center items-center transition-all ${
            isCurrentAyah
              ? "bg-secondary text-white shadow-md"
              : "bg-primary dark:bg-secondaryLight text-white dark:text-[#191f24] hover:bg-secondary"
          }`}
          aria-label={
            isThisAyahPlaying ? "Pause" : `Play ayah ${ayah.numberInSurah}`
          }
        >
          {isThisAyahPlaying ? (
            <BiPause size={18} />
          ) : (
            <BiPlay size={18} className="ml-0.5" />
          )}
        </button>
        {ayah.sajda.recommended &&
          (globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? (
            <img
              src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/ffffff/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png"
              alt="Sajdah Here"
            />
          ) : (
            <img
              src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png"
              alt="Sajdah Here"
            />
          ))}

        <div className="flex gap-4 text-2xl text-primary dark:text-secondaryLight">
          <BiShareAlt className="cursor-pointer" />
          <BiBookmark className="cursor-pointer" />
        </div>
      </div>
      <p className="text-3xl font-semibold text-right dark:text-secondaryLight">
        {ayah.text}
      </p>
      <p className="text-lg text-right dark:text-secondaryLight">
        {ayah.enTextTransliteration}
      </p>
      <p className="text-lg dark:text-secondaryLight">{ayah.enText}</p>
      <p className="text-lg dark:text-secondaryLight">{ayah.bnText}</p>
    </div>
  );
};

export default Ayahs;
