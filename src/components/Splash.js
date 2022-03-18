import logo from "../logo.png";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export const Splash = () => {
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    apiLoad();
  }, []);

  const apiLoad = () => {
    let count = 0;
    console.log(localStorage.getItem("isLoaded") === null);
    localStorage.getItem("isLoaded") === null &&
      localStorage.setItem("isLoaded", 0);

    parseInt(localStorage.getItem("isLoaded")) < 114 &&
      fetch(
        "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/singleSurah.min.json"
      )
        .then((res) => res.json())
        .then((data) => {
          let loadedData = {};
          Object.keys(data.singleSurah).map((key) => {
            loadedData[key] = {};
            loadedData[key] = {
              no: data.singleSurah[key].no,
              name: data.singleSurah[key].name,
              enName: data.singleSurah[key].enName,
              enNameTranslation: data.singleSurah[key].enNameTranslation,
              bnNameTranslation: data.singleSurah[key].bnNameTranslation,
              revelationType: data.singleSurah[key].revelationType,
              numberOfAyahs: data.singleSurah[key].numberOfAyahs,
              verses: [
                data.singleSurah[key].verses.map((verse) => {
                  return {
                    text: verse.text,
                    bnText: verse.bnText,
                    enText: verse.enText,
                    enTextTransliteration: verse.enTextTransliteration,
                    audioPrimary: verse.audioPrimary,
                    numberInSurah: verse.numberInSurah,
                  };
                }),
              ],
            };
          });

          console.log("Loaded");
          //   console.log(loadedData);
          Object.keys(loadedData).length > 0 &&
            Object.keys(loadedData).map((key) => {
              try {
                localStorage.setItem(key, JSON.stringify(loadedData[key]));
                localStorage.setItem("isLoaded", ++count);
                console.log("Surah", key, "Loaded");
              } catch (error) {
                alert(error);
                console.log(error);
                return;
              }
            });
        });
  };

  return (
    <div className="h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-primary font-bold text-3xl">
          بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className="text-primary font-bold text-3xl">Al Quran</h2>
        <p className="text-gray-700">Full Quran with Audio Player</p>
      </div>
      <div className="bg-primary py-4 h-full w-full rounded-3xl">
        <div className="h-full w-full grid justify-center items-end">
          <div className="relative">
            <lottie-player
              src="https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json"
              background="transparent"
              speed="1"
              style={{ width: 300, height: 300 }}
              loop
              autoplay
            ></lottie-player>
            <img
              src={logo}
              className="absolute inset-0 p-16 w-full"
              alt="logo"
            />
          </div>

          <NavLink
            to="/surah"
            className="text-center bg-alternateSecond px-5 py-2 rounded-2xl text-white font-semibold"
          >
            Browse Surah
          </NavLink>
        </div>
      </div>
    </div>
  );
};
