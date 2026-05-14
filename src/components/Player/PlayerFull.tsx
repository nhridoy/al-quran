import type React from "react";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiList,
  FiPauseCircle,
  FiPlayCircle,
  FiRepeat,
  FiShuffle,
  FiVolume2,
} from "react-icons/fi";
import { usePlayer } from "../../hooks/usePlayer";

export const PlayerFull: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    togglePlayPause,
    playNext,
    playPrev,
    seek,
    toggleShuffle,
    cycleRepeat,
    setIsPlayerOpen,
    playbackRate,
    setPlaybackRate,
    formatTime,
  } = usePlayer();
  const [showPlaylist, setShowPlaylist] = useState(false);

  if (!currentTrack) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    seek(time);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-gray-950 to-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 backdrop-blur-sm">
        <button
          onClick={() => setIsPlayerOpen(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <FiChevronDown className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-sm font-semibold text-white uppercase tracking-widest">
          Now Playing
        </h1>

        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-2 rounded-full transition-colors ${
            showPlaylist ? "bg-amber-500/20" : "hover:bg-white/10"
          }`}
        >
          <FiList className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Player view */}
        <div
          className={`flex-1 flex flex-col items-center justify-center p-6 transition-all ${showPlaylist ? "hidden md:flex" : ""}`}
        >
          {/* Album art with animated gradient */}
          <div className="w-64 h-64 md:w-80 md:h-80 mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500" />
            <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
              <div
                className={`absolute inset-0 ${
                  isPlaying
                    ? "animate-[spin_20s_linear_infinite]"
                    : "animate-none"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Center display */}
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {currentTrack.verse.numberInSurah}
                </div>
                <div className="text-2xl font-light text-white/80">
                  {currentTrack.surahName}
                </div>
              </div>
            </div>
          </div>

          {/* Track info */}
          <div className="text-center mb-8 max-w-xs">
            <h2 className="text-2xl font-bold text-white mb-2">
              Ayah {currentTrack.verse.numberInSurah}
            </h2>
            <p className="text-sm text-white/60 mb-4">
              {currentTrack.surahName}
            </p>
            <p className="text-xs text-white/40 line-clamp-2">
              {currentTrack.verse.text}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs mb-6">
            <div
              onClick={handleProgressClick}
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer group hover:h-1.5 transition-all"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button
              onClick={playPrev}
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
              title="Previous"
            >
              <FiChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FiPauseCircle className="w-8 h-8 text-black" />
              ) : (
                <FiPlayCircle className="w-8 h-8 text-black" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
              title="Next"
            >
              <FiChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Secondary controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffle
                  ? "bg-amber-500/20 text-amber-400"
                  : "hover:bg-white/10 text-white/60 hover:text-white"
              }`}
              title={isShuffle ? "Shuffle on" : "Shuffle off"}
            >
              <FiShuffle className="w-5 h-5" />
            </button>

            <button
              onClick={cycleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== "off"
                  ? "bg-amber-500/20 text-amber-400"
                  : "hover:bg-white/10 text-white/60 hover:text-white"
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <div className="w-5 h-5 relative">
                  <FiRepeat className="w-full h-full" />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                </div>
              ) : (
                <FiRepeat className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
              <FiVolume2 className="w-4 h-4 text-white/60" />
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Playlist view */}
        {showPlaylist && <PlaylistPanel />}
      </div>
    </div>
  );
};

const PlaylistPanel: React.FC = () => {
  const { playlist, currentTrackIndex, playTrack } = usePlayer();

  return (
    <div className="flex-1 md:w-80 bg-black/50 backdrop-blur-sm border-l border-white/10 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Playlist</h3>
        <div className="space-y-1">
          {playlist.map((verse, index) => (
            <button
              key={`${verse.numberInSurah}-${index}`}
              onClick={() => playTrack(index)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                index === currentTrackIndex
                  ? "bg-amber-500/30 border border-amber-400/50"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    index === currentTrackIndex
                      ? "bg-amber-500 text-black"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {verse.numberInSurah}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    Ayah {verse.numberInSurah}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {verse.bnText.substring(0, 40)}...
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
