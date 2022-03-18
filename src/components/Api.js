import React from "react";

export const Api = () => {
  // Load All Surah Audio from API for the first time when the component is mounted to the DOM and store in the local storage for home page
  //   const [allAudio, setAllAudio] = React.useState([]);
  //   React.useEffect(() => {
  //     // console.log(localStorage.getItem("allSurahAudioList") === null);
  //     localStorage.getItem("allSurahAudioList") === null &&
  //       fetch(
  //         "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/allSurahAudioList.min.json"
  //       )
  //         .then((res) => res.json())
  //         .then((data) => {
  //           let loadedData = [];
  //           data.map((ayah) => {
  //             loadedData.push({
  //               audioPrimary: ayah.audioPrimary,
  //               bnText: ayah.bnText,
  //               enName: ayah.enName,
  //               numberInSurah: ayah.numberInSurah,
  //               text: ayah.text,
  //             });
  //           });
  //           console.log("Loaded");
  //           localStorage.setItem("allSurahAudioList", JSON.stringify(loadedData));
  //         });
  //   }, []);

  // Load Single Surah Audio from API for the first time when the component is mounted to the DOM and store in the local storage for home page
  //   const [singleAudio, setSingleAudio] = React.useState([]);
  //   React.useEffect(() => {
  //     // console.log(localStorage.getItem("allSurahAudioList") === null);
  //     localStorage.getItem("singleSurahAudioList") === null &&
  //       fetch(
  //         "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/singleSurahAudioList.min.json"
  //       )
  //         .then((res) => res.json())
  //         .then((data) => {
  //           let loadedData = {};
  //           Object.keys(data.singleSurahAudioList).map((key) => {
  //             loadedData[key] = [];
  //             data.singleSurahAudioList[key].map((ayah) => {
  //               loadedData[key].push({
  //                 audioPrimary: ayah.audioPrimary,
  //                 bnText: ayah.bnText,
  //                 enName: ayah.enName,
  //                 numberInSurah: ayah.numberInSurah,
  //                 text: ayah.text,
  //               });
  //             });
  //           });

  //           console.log("Loaded");
  //           localStorage.setItem(
  //             "singleSurahAudioList",
  //             JSON.stringify(loadedData)
  //           );
  //         });
  //   }, []);

  // Load All Surah List from API for the first time when the component is mounted to the DOM and store in the local storage for home page
  //   const [allSurahList, setAllSurahList] = React.useState([]);
  //   React.useEffect(() => {
  //     // console.log(localStorage.getItem("allSurahAudioList") === null);
  //     localStorage.getItem("allSurahList") === null &&
  //       fetch(
  //         "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/allSurahList.min.json"
  //       )
  //         .then((res) => res.json())
  //         .then((data) => {
  //           let loadedData = [];
  //           data.map((surah) => {
  //             loadedData.push({
  //               no: surah.no,
  //               name: surah.name,
  //               enName: surah.enName,
  //               enNameTranslation: surah.enNameTranslation,
  //               bnNameTranslation: surah.bnNameTranslation,
  //               revelationType: surah.revelationType,
  //               numberOfAyahs: surah.numberOfAyahs,
  //             });
  //           });
  //           console.log("Loaded");
  //           localStorage.setItem("allSurahList", JSON.stringify(loadedData));
  //         });
  //   }, []);

  // Load Single Surah Object from API for the first time when the component is mounted to the DOM and store in the local storage for home page
  const [singleSurah, setSingleSurah] = React.useState([]);
  React.useEffect(() => {
    console.log(localStorage.getItem("isLoaded") === null);
    localStorage.getItem("isLoaded") === null &&
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
                console.log("Surah", key, "Loaded");
              } catch (error) {
                console.log(error);
              }
            });
          localStorage.setItem("isLoaded", true);
        });
  }, []);
  //   console.log(allAudio);

  const loadChecking = () => {
    // while (localStorage.getItem("isLoaded") === null) {
    //   console.log("Loading...");
    //   return <p>Loading.....</p>;
    // }
  };
  return <div>{loadChecking()}</div>;
};
