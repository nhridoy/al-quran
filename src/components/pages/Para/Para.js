import React, { useEffect } from "react";
import { Header } from "../../Header/Header";
import { useParams } from "react-router-dom";
import { ParaHead } from "../ParaHead/ParaHead";
import { paraCreation } from "../../../utilities/paraCreation";
import { Player } from "../Surah/Player";

export const Para = () => {
  const [currentPlaying, setCurrentPlaying] = React.useState({});
  const [audioInstance, setAudioInstance] = React.useState(null);
  const [ayahs, setAyahs] = React.useState([]);
  let current;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const paraDetails = paraCreation();
  const { id } = useParams();
  const para = paraDetails[id];
  useEffect(() => {
    setAyahs([]);
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
    para.map((surah) => {
      surah.verses.map((ayah) => {
        setAyahs((ayahs) => [...ayahs, ayah]);
      });
    });
  }, []);

  useEffect(() => {
    current = currentPlaying.totalNumber;
    if (current) {
      const currentayah = document.getElementById(`ayah-${current}`);

      currentayah.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

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
  return (
    <div className="">
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head={`Para ${id}`} />
      </div>
      <Player
        audioInstance={setAudioInstance}
        currentPlaying={setCurrentPlaying}
        surah={para}
      />
      {para.map((para, index) => (
        <ParaHead para={para} key={index} />
      ))}
    </div>
  );
};
