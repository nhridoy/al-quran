import { useEffect, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

export default function PlaylistDrawer() {
  const [leaving, setLeaving] = useState(false);
  const {
    showPlaylist,
    setShowPlaylist,
    playlist,
    currentTrack,
    playTrack,
    formatTime,
    duration,
  } = useAudioPlayer();

  useEffect(() => {
    if (showPlaylist) setLeaving(false);
  }, [showPlaylist]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => {
      setShowPlaylist(false);
      setLeaving(false);
    }, 300);
  };

  if (!showPlaylist && !leaving) return null;

  const grouped = new Map<
    number,
    { name: string; enName: string; tracks: typeof playlist }
  >();
  for (const track of playlist) {
    const existing = grouped.get(track.surahNo);
    if (existing) {
      existing.tracks.push(track);
    } else {
      grouped.set(track.surahNo, {
        name: track.surahName,
        enName: track.enName,
        tracks: [track],
      });
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default ${
          leaving
            ? "transition-all duration-300 ease-in-out opacity-0"
            : "animate-[fadeIn_0.2s_ease-out]"
        }`}
        onClick={handleClose}
        aria-label="Close playlist overlay"
        title="Close"
      />

      <div
        className={`relative w-full max-w-2xl max-h-[75vh] bg-white dark:bg-[#1a1f24] rounded-t-2xl shadow-2xl overflow-hidden ${
          leaving
            ? "transition-all duration-300 ease-in-out translate-y-full"
            : "animate-[slideUp_0.3s_ease-out]"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Playlist
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Close playlist"
            title="Close"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <title>Close</title>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(75vh-60px)]">
          {playlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <svg
                className="w-16 h-16 mb-4 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <title>No tracks</title>
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <p className="text-lg">No tracks in playlist</p>
              <p className="text-sm mt-1">
                Tap a play button on any ayah to start
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array.from(grouped.entries()).map(([surahNo, group]) => (
                <div key={surahNo}>
                  <div className="px-5 py-2 bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {surahNo}. {group.enName}
                    </span>
                  </div>
                  {group.tracks.map((track) => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => playTrack(track)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                          isActive ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                        title={`${track.enName} - Ayah ${track.ayahNumber}`}
                      >
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {track.ayahNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${
                              isActive
                                ? "text-primary font-semibold dark:text-secondary"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {track.transliterationText || track.translationText}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {track.arabicText}
                          </p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                          {formatTime(duration)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
