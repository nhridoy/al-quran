import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { useAudioProgressStore } from "@/store/audio";
import { type AudioEngine, createDefaultAudioEngine } from "./audioEngine";
import { createShuffledIndices } from "./audioUtils";
import type { Track } from "./types";

interface AudioElementConfig {
  playByIndexRef: React.MutableRefObject<(index: number) => void>;
  currentTrackRef: React.MutableRefObject<Track | null>;
  playlistRef: React.MutableRefObject<Track[]>;
  activeIndexRef: React.MutableRefObject<number>;
  repeatModeRef: React.MutableRefObject<"none" | "all" | "one">;
  shuffleIndicesRef: React.MutableRefObject<number[]>;
  shuffleCursorRef: React.MutableRefObject<number>;
  fallbackIndexRef: React.MutableRefObject<number>;
  playGenRef: React.MutableRefObject<number>;
  isPlayingRef: React.MutableRefObject<boolean>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export function useAudioElement(
  audioRef: React.MutableRefObject<AudioEngine | null>,
  config: AudioElementConfig,
) {
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    audioRef.current = createDefaultAudioEngine();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      useAudioProgressStore.getState().setCurrentTime(audio.currentTime);
    };
    const handleMetadata = () => {
      useAudioProgressStore.getState().setDuration(audio.duration);
    };
    const handleWaiting = () => configRef.current.setIsLoading(true);
    const handleCanPlay = () => configRef.current.setIsLoading(false);
    const handleError = () => {
      const cfg = configRef.current;
      const track = cfg.currentTrackRef.current;
      if (track && cfg.fallbackIndexRef.current < track.fallbackUrls.length) {
        const nextUrl = track.fallbackUrls[cfg.fallbackIndexRef.current];
        cfg.fallbackIndexRef.current++;
        cfg.setIsLoading(true);
        const fbGen = ++cfg.playGenRef.current;
        audio.src = nextUrl;
        audio
          .play()
          .then(() => {
            if (cfg.playGenRef.current !== fbGen) return;
            cfg.setIsPlaying(true);
            cfg.isPlayingRef.current = true;
          })
          .catch(() => {});
        return;
      }
      cfg.setIsPlaying(false);
      cfg.isPlayingRef.current = false;
      cfg.setIsLoading(false);
    };
    const handleEnded = () => {
      const cfg = configRef.current;
      const mode = cfg.repeatModeRef.current;
      const index = cfg.activeIndexRef.current;
      const tracks = cfg.playlistRef.current;
      const shuffleOrder = cfg.shuffleIndicesRef.current;
      const hasShuffle = shuffleOrder.length > 0;

      const advanceShuffle = () => {
        cfg.shuffleCursorRef.current++;
        if (cfg.shuffleCursorRef.current >= shuffleOrder.length) {
          cfg.shuffleIndicesRef.current = createShuffledIndices(
            tracks.length,
            -1,
          );
          cfg.shuffleCursorRef.current = 0;
        }
        return cfg.shuffleIndicesRef.current[cfg.shuffleCursorRef.current];
      };

      if (mode === "one") {
        const repGen = ++cfg.playGenRef.current;
        audio.currentTime = 0;
        audio
          .play()
          .then(() => {
            if (cfg.playGenRef.current !== repGen) return;
            cfg.setIsPlaying(true);
            cfg.isPlayingRef.current = true;
          })
          .catch(() => {});
      } else if (mode === "all") {
        const nextIndex = hasShuffle
          ? advanceShuffle()
          : (index + 1) % tracks.length;
        cfg.playByIndexRef.current(nextIndex);
      } else if (hasShuffle) {
        cfg.shuffleCursorRef.current++;
        if (cfg.shuffleCursorRef.current < shuffleOrder.length) {
          cfg.playByIndexRef.current(
            shuffleOrder[cfg.shuffleCursorRef.current],
          );
        } else {
          cfg.setIsPlaying(false);
          cfg.isPlayingRef.current = false;
        }
      } else if (index < tracks.length - 1) {
        cfg.playByIndexRef.current(index + 1);
      } else {
        cfg.setIsPlaying(false);
        cfg.isPlayingRef.current = false;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.destroy();
    };
  }, [audioRef]);
}
