import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import "./Playes.css";
import logo from "../../../logo.png";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";

export const Player = (props) => {
  const { surah } = props;
  const { id } = useParams();
  const [fullPlayList, setFullPlayList] = useState([]);
  const fullAudioList = [];

  useEffect(() => {
    id ? loadSingleSurahAudio(id) : loadSurahAudio();
  }, []);

  let audioInstance = null;
  // Load Full Surah
  const loadSurahAudio = () => {
    let totalSurah = parseInt(localStorage.getItem("isLoaded"));
    for (let index = 1; index <= totalSurah; index++) {
      let surah = JSON.parse(localStorage.getItem(index));
      surah.verses.map((verse) => {
        fullAudioList.push({
          name: surah.enName,
          singer: verse.numberInSurah,
          cover: logo,
          musicSrc: verse.audioPrimary,
          lyric: `[00:00.01] ${verse.bnText}`,
        });
      });
    }
  };
  // Load Single Surah
  const loadSingleSurahAudio = (id) => {
    let surah = JSON.parse(localStorage.getItem(id));

    surah.verses.map((verse) => {
      fullAudioList.push({
        name: surah.enName,
        singer: verse.numberInSurah,
        cover: logo,
        musicSrc: verse.audioPrimary,
        lyric: `[00:00.01] ${verse.bnText}`,
      });
    });
    setFullPlayList(fullAudioList);
  };
  // console.log(fullAudioList);
  // fullAudioList.length && console.log(fullAudioList);
  //   ReactDOM.findDOMNode(
  //     document.getElementsByClassName("react-draggable")[0] &&
  //       document
  //         .getElementsByClassName("react-draggable")[0]
  //         .setAttribute(
  //           "style",
  //           "left: 0px; top: 0px; transform: translate(85vw, 85vh);"
  //         )
  //   );
  return (
    <div>
      <ReactJkMusicPlayer
        audioLists={fullAudioList.length ? fullAudioList : fullPlayList}
        glassBg
        drag={false}
        seeked
        toggleMode
        autoPlay={false}
        clearPriorAudioLists={false}
        autoPlayInitLoadPlayList={false}
        showMiniProcessBar
        showMiniModeCover
        showProgressLoadBar
        showPlay
        showReload
        showDownload={false}
        showPlayMode
        showThemeSwitch={false}
        showLyric={true}
        showDestroy={false}
        preload="auto"
        remove={false}
        remember={true}
        spaceBar={true}
        responsive
        autoHiddenCover={true}
        quietUpdate
        restartCurrentOnPrev={true}
        showMediaSession={true}
        theme="auto"
        defaultPosition={{ right: "4vw", bottom: "2vh" }}
        bounds={{ right: "4vw", bottom: "2vh", left: "4vw", top: "2vh" }}
        sortableOptions={{
          sort: false,
          swap: false,
        }}
        // volumeFade={{ fadeIn: 500, fadeOut: 500 }}
        getAudioInstance={(instance) => {
          //   console.log(instance); // Test
          audioInstance = instance;
        }}
      />

      <button onClick={() => audioInstance.play()}>play</button>
    </div>
  );
};
