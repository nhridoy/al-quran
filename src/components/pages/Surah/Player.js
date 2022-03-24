import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import logo from "../../../logo.svg";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Player = (props) => {
  const { surah, currentPlaying, audioInstance } = props;
  const { id } = useParams();
  const [fullPlayList, setFullPlayList] = useState([]);
  const fullAudioList = [];

  useEffect(() => {
    id
      ? surah.length
        ? loadParaAudio()
        : loadSingleSurahAudio(id)
      : loadSurahAudio();
  }, []);

  // Load Full Surah
  const loadSurahAudio = () => {
    let totalSurah = parseInt(localStorage.getItem("isLoaded"));
    for (let index = 1; index <= totalSurah; index++) {
      let surah = JSON.parse(localStorage.getItem(index));
      surah.verses.map((verse) => {
        fullAudioList.push({
          name: surah.enName,
          totalNumber: verse.totalNumber,
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
    // console.log(surah);
    surah.verses.map((verse) => {
      fullAudioList.push({
        name: surah.enName,
        totalNumber: verse.totalNumber,
        singer: verse.numberInSurah,
        cover: logo,
        musicSrc: verse.audioPrimary,
        lyric: `[00:00.01] ${verse.bnText}`,
      });
    });
    setFullPlayList(fullAudioList);
  };
  // Load Surah for Para
  const loadParaAudio = () => {
    surah.map((surah) => {
      surah.verses.map((verse) => {
        fullAudioList.push({
          name: surah.enName,
          totalNumber: verse.totalNumber,
          singer: verse.numberInSurah,
          cover: logo,
          musicSrc: verse.audioPrimary,
          lyric: `[00:00.01] ${verse.bnText}`,
        });
      });
    });
    setFullPlayList(fullAudioList);
  };
  // console.log(fullPlayList);

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
    // restartCurrentOnPrev: true,
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

  return (
    <div>
      <ReactJkMusicPlayer
        audioLists={fullPlayList}
        {...options}
        getAudioInstance={(instance) => {
          // console.log(instance);
          audioInstance(instance);
        }}
        onAudioPlay={(index) => {
          currentPlaying(index);
          localStorage.setItem(
            "currentAudioIndex",
            JSON.stringify({ surahName: index.name, verseNumber: index.singer })
          );
          // console.log(index);
        }}
      />
    </div>
  );
};

export default Player;
