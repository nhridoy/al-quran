import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import "./Playes.css";
import logo from "../../../logo.png";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";

export const Player = () => {
  const { id } = useParams();
  const [audio, setAudio] = useState(null);
  const [fullPlayList, setFullPlayList] = useState([]);
  const fullAudioList = [];

  useEffect(() => {
    id ? loadSingleSurahAudio(id) : loadSurahAudio();
  }, []);

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
    setFullPlayList(fullAudioList);
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

  // Player Settings/Options
  const options = {
    glassBg: true,
    drag: false,
    seeked: true,
    toggleMode: true,
    autoPlay: false,
    clearPriorAudioLists: false,
    autoPlayInitLoadPlayList: false,
    showMiniProcessBar: true,
    showMiniModeCover: true,
    showProgressLoadBar: true,
    showPlay: true,
    showReload: true,
    showDownload: false,
    showPlayMode: true,
    showThemeSwitch: false,
    showLyric: true,
    showDestroy: false,
    preload: "auto",
    remove: false,
    remember: true,
    spaceBar: true,
    responsive: true,
    autoHiddenCover: true,
    quietUpdate: true,
    restartCurrentOnPrev: true,
    showMediaSession: true,
    theme: "auto",
    defaultPosition: { right: "4vw", bottom: "2vh" },
    bounds: { right: "4vw", bottom: "2vh", left: "4vw", top: "2vh" },
    sortableOptions: {
      sort: false,
      swap: false,
    },

    // defaultPlayIndex: 0,
    // theme: "dark",
    // mode: "full",

    // custom
    lyric: {
      color: "#fff",
      fontSize: "14px",
      textShadow: "0 0 5px #000",
    },
  };
  let audiotest;
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
        audioLists={fullPlayList}
        {...options}
        onAudioPause={(audio) => {
          // console.log(audio);
          // console.log(audio.audio.src);
          // console.log(audio.audio.currentTime);
          // console.log(audio.audio.duration);
          // console.log(audio.audio.paused);
          // console.log(audio.audio.ended);
          // console.log(audio.audio.buffered);
          // console.log(audio.audio.buffered.length);
          // console.log(audio.audio.buffered.end(0));
          // console.log(audio.audio.buffered.start(0));
        }}
        // getAudioInstance={(instance) => {
        //   //   console.log(instance); // Test
        //   audioInstance = instance;
        // }}
        // getAuioInstance={(instance) => console.log(instance)}
        // getAudioInstance={(instance) => {
        //   audiotest = instance;
        // }}
      />

      <button onClick={() => (audiotest.playbackRate = 2)}>
        set playback rate
      </button>
      <button onClick={() => audiotest.play()}>play</button>
    </div>
  );
};
