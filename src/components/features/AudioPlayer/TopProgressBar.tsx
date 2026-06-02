import { useAudioProgressStore } from "@/store/audio";

export default function TopProgressBar() {
  const currentTime = useAudioProgressStore((s) => s.currentTime);
  const duration = useAudioProgressStore((s) => s.duration);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-border dark:bg-dark-border">
      <div
        className="h-full bg-linear-to-r from-secondary to-primary transition-[width] duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
