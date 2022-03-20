import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../Header/Header";
import { BiShareAlt, BiBookmark } from "react-icons/bi";
import { IoPlayOutline } from "react-icons/io5";
import { SurahHead } from "./SurahHead";
import { Player } from "./Player";

export const Surah = (props) => {
  const { id } = useParams();
  const [surah, setSurah] = React.useState({});
  const [ayahs, setAyahs] = React.useState([]);
  const [currentPlaying, setCurrentPlaying] = React.useState({});
  let current;
  useEffect(() => {
    window.scrollTo(0, 0);
    loadSurahAyahs();
  }, []);

  useEffect(() => {
    current = currentPlaying.singer;
    if (current) {
      const currentayah = document.getElementById(`ayah-${current}`);
      currentayah.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      currentayah.classList.add("bg-alternateSecondDeep");
      document.getElementById(`ayah-${current - 1}`) &&
        document
          .getElementById(`ayah-${current - 1}`)
          .classList.remove("bg-alternateSecondDeep");

      document.getElementById(`ayah-${current + 1}`) &&
        document
          .getElementById(`ayah-${current + 1}`)
          .classList.remove("bg-alternateSecondDeep");
    }
  }, [currentPlaying]);

  // Load Sura ayahs from Local Storage
  const loadSurahAyahs = () => {
    const surah = JSON.parse(localStorage.getItem(id));
    setSurah(surah);
    document.title = surah.enName;
    setAyahs(surah.verses);
  };
  console.log(currentPlaying);
  return (
    <div>
      <div className="bg-white sticky top-0 left-0 w-full">
        <Header surah={surah} />
        <SurahHead surah={surah} />
      </div>
      <Player currentPlaying={setCurrentPlaying} surah={surah} />
      <div className="flex gap-3 flex-col">
        {ayahs.map((ayah, index) => (
          <SingleSurah ayah={ayah} key={ayah.numberInSurah} />
        ))}
      </div>
    </div>
  );
};

export const SingleSurah = (props) => {
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
