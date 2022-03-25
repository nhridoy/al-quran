import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../Header/Header";
import { SurahHead } from "./SurahHead";
// import Player from "./Player";
// import Ayahs from "../Ayahs/Ayahs";
import loadable from "@loadable/component";
const Player = loadable(() => import("./Player"));
const Ayahs = loadable(() => import("../Ayahs/Ayahs"));

export const Surah = (props) => {
  const { id } = useParams();
  const [surah, setSurah] = React.useState({});
  const [ayahs, setAyahs] = React.useState([]);
  const [currentPlaying, setCurrentPlaying] = React.useState({});
  const [audioInstance, setAudioInstance] = React.useState(null);
  let current;
  useEffect(() => {
    window.scrollTo(0, 0);
    loadSurahAyahs();
  }, []);
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);

  useEffect(() => {
    current = currentPlaying.totalNumber;
    if (current) {
      const currentayah = document.getElementById(`ayah-${current}`);

      currentayah.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      // currentayah.style.position = "relative";
      // // currentayah.style.zIndex = "-1";
      // currentayah.style.top = "25px";
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        // dark mode
        currentayah.classList.add("bg-[#14191d]");
        for (
          let index = ayahs[0]["totalNumber"];
          index <= ayahs[ayahs.length - 1]["totalNumber"];
          index++
        ) {
          if (current === index) {
            continue;
          }
          document
            .getElementById(`ayah-${index}`)
            .classList.contains("bg-[#14191d]") &&
            document
              .getElementById(`ayah-${index}`)
              .classList.remove("bg-[#14191d]");
        }
      } else {
        // Light Mode
        currentayah.classList.add("bg-alternateSecondDeep");
        for (
          let index = ayahs[0]["totalNumber"];
          index <= ayahs[ayahs.length - 1]["totalNumber"];
          index++
        ) {
          if (current === index) {
            continue;
          }
          document
            .getElementById(`ayah-${index}`)
            .classList.contains("bg-alternateSecondDeep") &&
            document
              .getElementById(`ayah-${index}`)
              .classList.remove("bg-alternateSecondDeep");
        }
      }
    }
  }, [currentPlaying]);

  // Load Sura ayahs from Local Storage
  const loadSurahAyahs = () => {
    const surah = JSON.parse(localStorage.getItem(id));
    setSurah(surah);
    document.title = surah.enName;
    setAyahs(surah.verses);
  };
  // console.log(audioInstance);
  return (
    <div>
      <div className="bg-white dark:bg-[#20282e] sticky top-0 left-0 w-full">
        <Header surah={surah} />
        <SurahHead audioInstance={audioInstance} surah={surah} />
      </div>
      <Player
        audioInstance={setAudioInstance}
        currentPlaying={setCurrentPlaying}
        surah={[]}
      />
      <div className="flex gap-3 flex-col">
        {ayahs.map((ayah, index) => (
          <Ayahs ayah={ayah} key={ayah.numberInSurah} />
        ))}
      </div>
    </div>
  );
};
