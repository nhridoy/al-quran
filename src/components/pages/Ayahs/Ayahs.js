import React from "react";
import { BiShareAlt, BiBookmark } from "react-icons/bi";
import { IoPlayOutline } from "react-icons/io5";

const Ayahs = (props) => {
  // console.log(props);
  const { ayah } = props;
  return (
    <div
      id={`ayah-${ayah.totalNumber}`}
      className="rounded-lg flex flex-col gap-4 border-b-2 p-4"
    >
      <div className="flex bg-secondaryLight dark:bg-[#191f24] p-3 rounded-lg justify-between items-center">
        <p
          id="surahNumber"
          className="bg-primary dark:bg-secondaryLight w-10 h-10 text-white dark:text-[#191f24] font-semibold flex justify-center items-center rounded-full"
        >
          {ayah.numberInSurah}
        </p>
        {ayah.sajda.recommended && (
          <img
            src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png"
            alt="Sajdah Here"
          />
        )}

        <div className="flex text-primary dark:text-secondaryLight text-2xl gap-4">
          <BiShareAlt className="cursor-pointer" />
          <IoPlayOutline className="cursor-pointer" />
          <BiBookmark className="cursor-pointer" />
        </div>
      </div>
      <p className="text-right font-semibold text-3xl dark:text-secondaryLight">
        {ayah.text}
      </p>
      <p className="text-right text-lg dark:text-secondaryLight">
        {ayah.enTextTransliteration}
      </p>
      <p className=" text-lg dark:text-secondaryLight">{ayah.enText}</p>
      <p className=" text-lg dark:text-secondaryLight">{ayah.bnText}</p>
    </div>
  );
};

export default Ayahs;
