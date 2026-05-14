import type React from "react";
import { CgPlayTrackNextO, CgPlayTrackPrevO } from "react-icons/cg";
import { FiPauseCircle, FiPlayCircle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMusic } from "../../../context/MusicContext";
import type { SurahData } from "../../../types";

interface SurahHeadProps {
  surah: SurahData;
}

export const SurahHead: React.FC<SurahHeadProps> = ({ surah }) => {
  const { isPlaying, play, pause, playNext, playPrev } = useMusic();
  const notify = () => toast.warning("Audio is Loading...");

  return (
    <div className="flex flex-col items-center gap-3 px-5 py-1 mb-5 text-white shadow-lg md:flex-row md:justify-around md:px-8 bg-gradient-to-tl rounded-2xl from-alternateOne to-secondary shadow-alternateOne">
      <div className="flex flex-col items-center gap-3 px-3 py-5 border-b md:border-b-0">
        <div className="flex gap-3 md:gap-8">
          <h2 className="text-xl font-semibold">{surah.name}</h2>
          <h2 className="text-xl font-semibold">{surah.bnNameTranslation}</h2>
        </div>
        <div className="flex gap-3 md:gap-8">
          <h2 className="text-xl font-semibold">{surah.enName}</h2>
          <h2 className="text-xl font-semibold">{surah.enNameTranslation}</h2>
        </div>
      </div>
      <div className="flex gap-3 uppercase">
        <span className="flex items-center gap-1">
          {surah.revelationType === "Meccan" ? (
            <img
              style={{ width: "16px", height: "16px" }}
              src="https://img.icons8.com/external-color-outline-adri-ansyah/64/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png"
              alt="Meccan"
            />
          ) : (
            <img
              style={{ width: "16px", height: "16px" }}
              src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png"
              alt="Medinan"
            />
          )}
          <span className="uppercase">{surah.revelationType}</span>
        </span>
        <span>&bull;</span>
        <p>{surah.numberOfAyahs} Varses</p>
      </div>
      <p className="mb-4 text-2xl md:mb-0">
        بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ
      </p>
      <div className="flex gap-5">
        <CgPlayTrackPrevO
          className="mb-4 text-4xl transition-opacity cursor-pointer md:mb-0 hover:text-opacity-70"
          onClick={() => {
            try {
              playPrev();
            } catch (e) {
              notify();
            }
          }}
        />
        {isPlaying ? (
          <FiPauseCircle
            className="mb-4 text-4xl transition-opacity cursor-pointer md:mb-0 hover:text-opacity-70"
            onClick={() => {
              try {
                pause();
              } catch (e) {
                notify();
              }
            }}
          />
        ) : (
          <FiPlayCircle
            className="mb-4 text-4xl transition-opacity cursor-pointer md:mb-0 hover:text-opacity-70"
            onClick={() => {
              try {
                play();
              } catch (e) {
                notify();
              }
            }}
          />
        )}
        <CgPlayTrackNextO
          className="mb-4 text-4xl transition-opacity cursor-pointer md:mb-0 hover:text-opacity-70"
          onClick={() => {
            try {
              playNext();
            } catch (e) {
              notify();
            }
          }}
        />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};
