import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../../logo.svg";
import type { ParaSurah, SurahData } from "../../../types";

interface AudioItem {
  name: string;
  totalNumber: number;
  singer: number;
  cover: string;
  musicSrc: string;
  lyric: string;
}

interface PlayerProps {
  surah: SurahData[] | ParaSurah[];
  currentPlaying: (index: AudioItem) => void;
  audioInstance: (instance: unknown) => void;
}

const Player: React.FC<PlayerProps> = ({
  surah,
  currentPlaying,
  audioInstance,
}) => {
  const { id } = useParams();
  const [fullPlayList, setFullPlayList] = useState<AudioItem[]>([]);
  const fullAudioList: AudioItem[] = [];

  useEffect(() => {
    id
      ? surah.length
        ? loadParaAudio()
        : loadSingleSurahAudio(id)
      : loadSurahAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSurahAudio = () => {
    const totalSurah = parseInt(localStorage.getItem("isLoaded") || "0");
    for (let index = 1; index <= totalSurah; index++) {
      const surahData: SurahData = JSON.parse(
        localStorage.getItem(String(index)) || "{}",
      );
      surahData.verses.forEach((verse) => {
        fullAudioList.push({
          name: surahData.enName,
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

  const loadSingleSurahAudio = (surahId: string) => {
    const surahData: SurahData = JSON.parse(
      localStorage.getItem(surahId) || "{}",
    );
    surahData.verses.forEach((verse) => {
      fullAudioList.push({
        name: surahData.enName,
        totalNumber: verse.totalNumber,
        singer: verse.numberInSurah,
        cover: logo,
        musicSrc: verse.audioPrimary,
        lyric: `[00:00.01] ${verse.bnText}`,
      });
    });
    setFullPlayList(fullAudioList);
  };

  const loadParaAudio = () => {
    surah.forEach((surahItem) => {
      surahItem.verses.forEach((verse) => {
        fullAudioList.push({
          name: surahItem.enName,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
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
    showMediaSession: true,
    theme: "auto",
    defaultPosition: { right: "4vw", bottom: "2vh" },
    bounds: { right: "4vw", bottom: "2vh", left: "4vw", top: "2vh" },
    sortableOptions: {
      sort: false,
      swap: false,
    },
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
        getAudioInstance={(instance: unknown) => {
          audioInstance(instance);
        }}
        onAudioPlay={(index: AudioItem) => {
          currentPlaying(index);
          localStorage.setItem(
            "currentAudioIndex",
            JSON.stringify({
              surahName: index.name,
              verseNumber: index.singer,
            }),
          );
        }}
      />
    </div>
  );
};

export default Player;
