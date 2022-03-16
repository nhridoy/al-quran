import React from "react";
import { FiPlayCircle } from "react-icons/fi";

export const SurahHead = (props) => {
  const { surah } = props;
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:px-8 items-center p-5 gap-3 bg-gradient-to-tl rounded-2xl text-white from-secondary to-alternateOne mb-5 shadow-xl shadow-alternateOne">
      <div className="flex flex-col items-center gap-3 border-b md:border-b-0 p-5">
        <h2 className="font-semibold text-3xl">{surah.name}</h2>
        <h2 className="font-semibold text-3xl">{surah.englishName}</h2>
        <h2>{surah.englishNameTranslation}</h2>
      </div>
      <div className="flex uppercase gap-3">
        <p>{surah.revelationType}</p>
        <span>&bull;</span>
        <p>{surah.numberOfAyahs} Varses</p>
      </div>
      <p className="text-2xl">
        بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ
      </p>
      <FiPlayCircle className="text-4xl cursor-pointer" />
    </div>
  );
};
