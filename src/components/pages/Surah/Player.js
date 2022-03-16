import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import "./Playes.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Player = (props) => {
  const { surah } = props;
  const { id } = useParams();
  const [playList, setPlayList] = useState({});
  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => setPlayList(data.data));
  }, []);
  //   playList.ayahs.map((ayah) => console.log(ayah));

  const audioList = [];

  Object.keys(playList).length &&
    playList.ayahs.map((ayah, index) =>
      audioList.push({
        name: ayah.text,
        singer: "",
        cover: "",
        musicSrc: ayah.audio,
      })
    );
  //   console.log(audioList);

  return (
    <div>
      <ReactJkMusicPlayer
        audioLists={audioList}
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
      />
    </div>
  );
};
