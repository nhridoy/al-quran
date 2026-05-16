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
        className={`absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm ${
          leaving
            ? "opacity-0 transition-all duration-300 ease-in-out"
            : "animate-[fadeIn_0.2s_ease-out]"
        }`}
        onClick={handleClose}
        aria-label="Close playlist overlay"
        title="Close"
      />

      <div
        className={`relative w-full max-w-2xl max-h-[75vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-dark-surface-card ${
          leaving
            ? "translate-y-full translate-y-full transition-all duration-300 ease-in-out"
            : "animate-[slideUp_0.3s_ease-out]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
            Playlist
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
            aria-label="Close playlist"
            title="Close"
          >
            <svg
              className="h-5 w-5"
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
        <div className="max-h-[calc(75vh-60px)] overflow-y-auto">
          {playlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted dark:text-dark-text-muted">
              <svg
                className="mb-4 h-16 w-16 opacity-50"
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
              <p className="mt-1 text-sm">
                Tap a play button on any ayah to start
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-dark-border">
              {Array.from(grouped.entries()).map(([surahNo, group]) => (
                <div key={surahNo}>
                  <div className="bg-surface-alt px-5 py-2 dark:bg-dark-surface-alt">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted">
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
                        className={`flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt ${
                          isActive ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                        title={`${track.enName} - Ayah ${track.ayahNumber}`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-gradient-to-br from-primary to-secondary text-white"
                              : "bg-surface-alt text-text-secondary dark:bg-dark-surface-alt dark:text-dark-text-secondary"
                          }`}
                        >
                          {track.ayahNumber}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm ${
                              isActive
                                ? "font-semibold text-primary dark:text-secondary-light"
                                : "text-text-primary dark:text-dark-text-primary"
                            }`}
                          >
                            {track.transliterationText || track.translationText}
                          </p>
                          <p className="truncate text-xs text-text-muted dark:text-dark-text-muted">
                            {track.arabicText}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-text-muted dark:text-dark-text-muted">
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
