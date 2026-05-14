import type React from "react";
import { BiBookmark, BiShareAlt } from "react-icons/bi";
import type { Verse } from "../../../types";

interface AyahsProps {
  ayah: Verse;
}

const Ayahs: React.FC<AyahsProps> = ({ ayah }) => {
  return (
    <div
      id={`ayah-${ayah.totalNumber}`}
      className="flex flex-col gap-4 p-4 border-b-2 rounded-lg"
    >
      <div className="flex bg-secondaryLight dark:bg-[#191f24] p-3 rounded-lg justify-between items-center">
        <p
          id="surahNumber"
          className="bg-primary dark:bg-secondaryLight w-10 h-10 text-white dark:text-[#191f24] font-semibold flex justify-center items-center rounded-full"
        >
          {ayah.numberInSurah}
        </p>
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
