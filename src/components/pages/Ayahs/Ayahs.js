import React from "react";
import { BiShareAlt, BiBookmark } from "react-icons/bi";
import { IoPlayOutline } from "react-icons/io5";

export const Ayahs = (props) => {
  // console.log(props);
  const { ayah } = props;
  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      className="rounded-lg flex flex-col gap-4 border-b-2 p-4"
    >
      <div className="flex bg-secondaryLight p-3 rounded-lg justify-between items-center">
        <p
          id="surahNumber"
          className="bg-primary w-10 h-10 text-white font-semibold flex justify-center items-center rounded-full"
        >
          {ayah.numberInSurah}
        </p>
        {ayah.sajda.recommended && (
          <img src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png" />
        )}

        <div className="flex text-primary text-2xl gap-4">
          <BiShareAlt className="cursor-pointer" />
          <IoPlayOutline className="cursor-pointer" />
          <BiBookmark className="cursor-pointer" />
        </div>
      </div>
      <p className="text-right font-semibold text-3xl">{ayah.text}</p>
      <p className="text-right text-lg">{ayah.enTextTransliteration}</p>
      <p className=" text-lg">{ayah.enText}</p>
      <p className=" text-lg">{ayah.bnText}</p>
    </div>
  );
};
