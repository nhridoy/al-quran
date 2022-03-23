export const dataFetching = (setLoading) => {
  document.title = "Al Quran";
  let count = 0;
  console.log(localStorage.getItem("isLoaded") === null);
  localStorage.getItem("isLoaded") === null &&
    localStorage.setItem("isLoaded", 0);

  if (parseInt(localStorage.getItem("isLoaded")) < 114) {
    return fetch(
      "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v2/singleSurah.min.json"
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
            verses: data.singleSurah[key].verses.map((verse) => {
              return {
                text: verse.text,
                bnText: verse.bnText,
                enText: verse.enText,
                enTextTransliteration: verse.enTextTransliteration,
                audioPrimary: verse.audioPrimary,
                numberInSurah: verse.numberInSurah,
                juz: verse.juz,
                sajda: verse.sajda,
              };
            }),
          };
        });

        console.log("Loaded");

        Object.keys(loadedData).length > 0 &&
          Object.keys(loadedData).map((key) => {
            try {
              // console.log(loadedData[key]);
              localStorage.setItem(key, JSON.stringify(loadedData[key]));
              localStorage.setItem("isLoaded", ++count);

              // Disabling the loading state
              setLoading(parseInt(localStorage.getItem("isLoaded")) < 114);
              // console.log(parseInt(localStorage.getItem("isLoaded")) < 114);

              // setLoading(!(parseInt(localStorage.getItem("isLoaded")) < 114));
              console.log("Surah", key, "Loaded");
            } catch (error) {
              // alert("Error Fetching Surah! Please Reload The Page Again.");
              if (!alert("Error Fetching Surah! Press OK to Try Again.")) {
                window.location.reload();
              }
              console.log(error);
              localStorage.clear();
            }
          });
      });
  }
};
