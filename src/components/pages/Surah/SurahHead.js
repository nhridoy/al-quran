import React from "react";
import { FiPlayCircle, FiPauseCircle } from "react-icons/fi";
import { CgPlayTrackPrevO, CgPlayTrackNextO } from "react-icons/cg";

export const SurahHead = (props) => {
  const { surah, audioInstance } = props;
  const [isPlaying, setIsPlaying] = React.useState(false);
  return (
    <div className="flex flex-col md:flex-row md:justify-around md:px-8 items-center px-5 py-1 gap-3 bg-gradient-to-tl rounded-2xl text-white from-alternateOne to-secondary mb-5 shadow-lg shadow-alternateOne">
      <div className="flex flex-col items-center gap-3 border-b md:border-b-0 py-5 px-3">
        <div className="flex gap-3 md:gap-8">
          <h2 className="font-semibold text-xl">{surah.name}</h2>
          <h2 className="font-semibold text-xl">{surah.bnNameTranslation}</h2>
        </div>
        <div className="flex gap-3 md:gap-8">
          <h2 className="font-semibold text-xl">{surah.enName}</h2>
          <h2 className="font-semibold text-xl">{surah.enNameTranslation}</h2>
        </div>
      </div>
      <div className="flex uppercase gap-3">
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
        {/* <p>{surah.revelationType}</p> */}
        <span>&bull;</span>
        <p>{surah.numberOfAyahs} Varses</p>
      </div>
      <p className="text-2xl mb-4 md:mb-0">
        بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ
      </p>
      <div className="flex gap-5">
        <CgPlayTrackPrevO
          className="text-4xl cursor-pointer mb-4 md:mb-0"
          onClick={() => {
            audioInstance.playPrev();
            setIsPlaying(true);
          }}
        />
        {isPlaying ? (
          <FiPauseCircle
            className="text-4xl cursor-pointer mb-4 md:mb-0"
            onClick={() => {
              audioInstance.pause();
              setIsPlaying(false);
            }}
          />
        ) : (
          <FiPlayCircle
            className="text-4xl cursor-pointer mb-4 md:mb-0"
            onClick={() => {
              audioInstance.play();
              setIsPlaying(true);
            }}
          />
        )}
        <CgPlayTrackNextO
          className="text-4xl cursor-pointer mb-4 md:mb-0"
          onClick={() => {
            audioInstance.playNext();
            setIsPlaying(true);
          }}
        />
      </div>
    </div>
  );
};
