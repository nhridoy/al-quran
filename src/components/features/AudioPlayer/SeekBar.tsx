import { useEffect, useRef, useState } from "react";
import { useAudioProgressStore } from "@/store/audio";
import { useAudioPlayerActions } from "./AudioPlayerContext";
import { formatTime } from "./audioUtils";

export default function SeekBar() {
  const currentTime = useAudioProgressStore((s) => s.currentTime);
  const duration = useAudioProgressStore((s) => s.duration);
  const { seek } = useAudioPlayerActions();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const seekFnRef = useRef(seek);
  const durationRef = useRef(duration);
  useEffect(() => {
    seekFnRef.current = seek;
  }, [seek]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const handleSeek = (clientX: number) => {
    const bar = barRef.current;
    const dur = durationRef.current;
    if (!bar || dur <= 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekFnRef.current(ratio * dur);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleSeekRef = useRef(handleSeek);
  useEffect(() => {
    handleSeekRef.current = handleSeek;
  });

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleSeekRef.current(e.clientX);
    const onMouseUp = () => setIsDragging(false);
    globalThis.addEventListener("mousemove", onMouseMove);
    globalThis.addEventListener("mouseup", onMouseUp);
    return () => {
      globalThis.removeEventListener("mousemove", onMouseMove);
      globalThis.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex w-full items-center gap-3">
      <span className="w-10 text-right text-xs tabular-nums text-text-muted dark:text-dark-text-muted">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        className="relative flex-1 h-2 cursor-pointer rounded-full bg-border dark:bg-dark-border group"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-linear-to-r from-secondary to-primary transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-secondary bg-white shadow-md opacity-0 transition-opacity dark:bg-gray-200 group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
      <span className="w-10 text-xs tabular-nums text-text-muted dark:text-dark-text-muted">
        {formatTime(duration)}
      </span>
    </div>
  );
}
