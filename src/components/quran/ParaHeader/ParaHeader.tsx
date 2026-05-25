import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CgPlayTrackNextO, CgPlayTrackPrevO } from "react-icons/cg";
import { FiPauseCircle, FiPlayCircle } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getAudioData, mergeAudioWithSurah } from "../../../lib/db";
import { useSettings } from "../../../store/settings";
import type { ParaSurah } from "../../../types";
import type { Track } from "../../features/AudioPlayer";
import { useAudioPlayer } from "../../features/AudioPlayer";
import Ayahs from "../Ayah/Ayah";

interface ParaHeadProps {
  para: ParaSurah;
  allSegments: ParaSurah[];
}

function buildPlaylistFromPara(segments: ParaSurah[]): Track[] {
  const tracks: Track[] = [];
  for (const segment of segments) {
    for (const verse of segment.verses) {
      if (!verse.audio?.primary) continue;
      tracks.push({
        id: `${segment.no}-${verse.numberInSurah}`,
        surahNo: segment.no,
        ayahNumber: verse.numberInSurah,
        totalNumber: verse.totalNumber,
        surahName: segment.name,
        enName: segment.enName,
        arabicText: verse.text.arText,
        translationText: verse.text.enText,
        transliterationText: verse.text.enTextTransliteration,
        audioUrl: verse.audio.primary,
      });
    }
  }
  return tracks;
}

export const ParaHeader: React.FC<ParaHeadProps> = ({ para, allSegments }) => {
  const { id } = useParams();
  const { currentTrack, isPlaying, togglePlay, setPlaylist, prev, next } =
    useAudioPlayer();
  const reciterId = useSettings((s) => s.reciterId);
  const [segmentsWithAudio, setSegmentsWithAudio] = useState<
    ParaSurah[] | null
  >(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (segmentsWithAudio || loadingRef.current) return;
    loadingRef.current = true;
    (async () => {
      const merged = await Promise.all(
        allSegments.map(async (seg) => {
          const audioUrls = await getAudioData(reciterId, seg.no);
          const mergedSurah = await mergeAudioWithSurah(seg, audioUrls);
          return { ...seg, verses: mergedSurah.verses };
        }),
      );
      setSegmentsWithAudio(merged);
    })();
  }, [allSegments, reciterId, segmentsWithAudio]);

  const paraTracks = useMemo(
    () => (segmentsWithAudio ? buildPlaylistFromPara(segmentsWithAudio) : []),
    [segmentsWithAudio],
  );

  const isCurrentPara =
    currentTrack !== null &&
    allSegments.some((seg) => seg.no === currentTrack.surahNo);

  const handlePlay = () => {
    if (isCurrentPara) {
      togglePlay();
    } else {
      const idx = paraTracks.findIndex(
        (t) =>
          t.surahNo === para.no &&
          t.ayahNumber === para.verses[0]?.numberInSurah,
      );
      setPlaylist(paraTracks, Math.max(idx, 0));
    }
  };

  const handlePrev = () => {
    if (isCurrentPara) {
      prev();
    } else {
      setPlaylist(paraTracks, 0);
    }
  };

  const handleNext = () => {
    if (isCurrentPara) {
      next();
    } else {
      setPlaylist(paraTracks, 0);
    }
  };

  return (
    <div className="mb-4">
      <div className="sticky top-0 z-20 mx-4 mb-4 overflow-hidden rounded-2xl bg-linear-to-r from-primary to-secondary shadow-lg md:mx-6">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">
              {para.no}
            </div>
            <div>
              <div className="font-semibold text-white">{para.enName}</div>
              <div className="flex flex-col md:flex-row md:gap-2 text-xs text-white/60">
                <span className="uppercase">
                  {para.revelationType === "Meccan" ? "Makkah" : "Madinah"}
                </span>
                <span className="hidden md:inline">&bull;</span>
                <span>
                  {para.verses.length} verses in para {id}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-2 text-right">
              <p className="font-arabic text-sm text-white">{para.name}</p>
              <p className="text-xs text-white/60">{para.enNameTranslation}</p>
            </div>
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 active:scale-90"
              aria-label="Previous"
            >
              <CgPlayTrackPrevO className="text-lg text-white" />
            </button>
            <button
              type="button"
              onClick={handlePlay}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-primary shadow transition-all hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isCurrentPara && isPlaying ? (
                <FiPauseCircle className="text-xl" />
              ) : (
                <FiPlayCircle className="text-xl" />
              )}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 active:scale-90"
              aria-label="Next"
            >
              <CgPlayTrackNextO className="text-lg text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-4 space-y-3 md:mx-6">
        {para.verses.map((verse) => (
          <Ayahs
            ayah={verse}
            key={`${verse.numberInSurah} + ${verse.juz}`}
            surah={para}
            tracklist={paraTracks}
            surahNo={para.no}
          />
        ))}
      </div>
    </div>
  );
};
