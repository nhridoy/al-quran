import type React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiPauseCircle,
  FiPlayCircle,
} from "react-icons/fi";
import { usePlayer } from "../../hooks/usePlayer";

export const PlayerMini: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    setIsPlayerOpen,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black to-black/80 border-t border-white/10 backdrop-blur-xl">
      <div className="px-4 py-3">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />

        <div className="flex items-center justify-between gap-3">
          {/* Album art and track info */}
          <button
            onClick={() => setIsPlayerOpen(true)}
            className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            {/* Animated album art */}
            <div
              className={`w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg ${
                isPlaying ? "animate-pulse" : ""
              }`}
            >
              <div className="text-white/60 text-xs font-bold text-center px-1">
                {currentTrack.verse.numberInSurah}
              </div>
            </div>

            {/* Track info */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentTrack.surahName}
              </p>
              <p className="text-xs text-white/60 truncate">
                Ayah {currentTrack.verse.numberInSurah}
              </p>
            </div>
          </button>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={playPrev}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Previous"
            >
              <FiChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FiPauseCircle className="w-6 h-6 text-amber-400" />
              ) : (
                <FiPlayCircle className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Next"
            >
              <FiChevronRight className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setIsPlayerOpen(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors ml-1"
              title="Expand player"
            >
              <FiChevronUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
