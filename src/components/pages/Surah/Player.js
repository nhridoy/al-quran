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
  const [playList, setPlayList] = useState({});
  const [fullPlayList, setFullPlayList] = useState([]);
  useEffect(() => {
    id
      ? fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`)
          .then((res) => res.json())
          .then((data) => setPlayList(data.data))
      : fetch(`https://api.alquran.cloud/v1/quran/ar.alafasy`)
          .then((res) => res.json())
          .then((data) => setFullPlayList(data.data.surahs));
  }, []);
  //   playList.ayahs.map((ayah) => console.log(ayah));

  const audioList = [];
  const fullAudioList = [];
  let audioInstance = null;

  Object.keys(playList).length
    ? playList.ayahs.map((ayah, index) =>
        audioList.push({
          name: ayah.text,
          singer: ayah.numberInSurah,
          cover: logo,
          musicSrc: ayah.audio,
        })
      )
    : fullPlayList.map((surah, index) => {
        // console.log(surah.ayahs);
        surah.ayahs.map((ayah, index) => {
          //   console.log(ayah);
          fullAudioList.push({
            name: surah.englishName,
            singer: ayah.numberInSurah,
            cover: logo,
            musicSrc: ayah.audio,
          });
        });
        // Object.keys(surah).map((singleSurah, index) => {
        //   console.log(singleSurah);
        //   //   fullAudioList.push({
        //   //     name: ayah.text,
        //   //     singer: ayah.numberInSurah,
        //   //     cover: logo,
        //   //     musicSrc: ayah.audio,
        //   //   });
        // });
      });
  console.log(audioList);
  fullAudioList.length && console.log(fullAudioList);
  ReactDOM.findDOMNode(
    document.getElementsByClassName("react-draggable")[0] &&
      document
        .getElementsByClassName("react-draggable")[0]
        .setAttribute(
          "style",
          "left: 0px; top: 0px; transform: translate(85vw, 85vh);"
        )
  );
  return (
    <div>
      <ReactJkMusicPlayer
        audioLists={audioList.length ? audioList : fullAudioList}
        glassBg
        drag
        seeked
        toggleMode
        autoPlay={false}
        clearPriorAudioLists
        autoPlayInitLoadPlayList={false}
        showMiniProcessBar
        showMiniModeCover
        showProgressLoadBar
        showPlay
        showReload
        showDownload={false}
        showPlayMode
        showThemeSwitch={false}
        showLyric={false}
        showDestroy={false}
        preload
        remove={false}
        remember
        spaceBar
        responsive
        autoHiddenCover={false}
        quietUpdate
        restartCurrentOnPrev
        showMediaSession
        theme="auto"
        // volumeFade={{ fadeIn: 500, fadeOut: 500 }}
        getAudioInstance={(instance) => {
          console.log(instance);
          audioInstance = instance;
        }}
      />

      <button onClick={() => audioInstance.play()}>play</button>
    </div>
  );
};
