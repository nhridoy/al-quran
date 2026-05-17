import { useCallback, useEffect, useRef, useState } from "react";
import { BiReset } from "react-icons/bi";
import { MdLoop } from "react-icons/md";
import { Header } from "../../Header/Header";

interface Dhikr {
  id: string;
  label: string;
  arabic: string;
  target: number;
}

const PRESETS: Dhikr[] = [
  { id: "subhanallah", label: "SubhanAllah", arabic: "سُبْحَانَ اللّٰه", target: 33 },
  {
    id: "alhamdulillah",
    label: "Alhamdulillah",
    arabic: "الْحَمْدُ لِلّٰه",
    target: 33,
  },
  { id: "allahuAkbar", label: "Allahu Akbar", arabic: "اللّٰهُ أَكْبَر", target: 34 },
];

function loadCounts(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem("tasbihCounts") || "{}");
  } catch {
    return {};
  }
}

function saveCounts(counts: Record<string, number>) {
  localStorage.setItem("tasbihCounts", JSON.stringify(counts));
}

export default function Tasbih() {
  const [activeId, setActiveId] = useState(PRESETS[0].id);
  const [counts, setCounts] = useState<Record<string, number>>(loadCounts);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const active = PRESETS.find((p) => p.id === activeId) || PRESETS[0];
  const currentCount = counts[activeId] || 0;
  const progress = Math.min(currentCount / active.target, 1);

  useEffect(() => {
    saveCounts(counts);
  }, [counts]);

  const increment = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10);
    setCounts((prev) => ({
      ...prev,
      [activeId]: (prev[activeId] || 0) + 1,
    }));
  }, [activeId]);

  const resetCurrent = useCallback(() => {
    setCounts((prev) => ({ ...prev, [activeId]: 0 }));
  }, [activeId]);

  const resetAll = useCallback(() => {
    const empty = Object.fromEntries(PRESETS.map((p) => [p.id, 0]));
    setCounts(empty);
  }, []);

  const handlePointerDown = useCallback(() => {
    isLongPress.current = false;
    longPressRef.current = setTimeout(() => {
      isLongPress.current = true;
      resetCurrent();
      if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    }, 600);
  }, [resetCurrent]);

  const handlePointerUp = useCallback(() => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
    if (!isLongPress.current) increment();
    isLongPress.current = false;
  }, [increment]);

  const handlePointerLeave = useCallback(() => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
    isLongPress.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        increment();
      }
    },
    [increment],
  );

  return (
    <div className="min-h-screen">
      <Header head="Tasbih" showBack />
      <div className="mx-4 md:mx-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Tasbih Counter
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Tap to count. Long-press to reset.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {PRESETS.map((dhikr) => (
            <button
              key={dhikr.id}
              type="button"
              onClick={() => setActiveId(dhikr.id)}
              className={`cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeId === dhikr.id
                  ? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
                  : "border border-border bg-surface text-text-secondary hover:bg-surface-alt dark:border-dark-border dark:bg-dark-surface-card dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
              }`}
            >
              {dhikr.label} ({dhikr.target})
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center py-8">
          <button
            type="button"
            aria-label={`Count ${active.label}: ${currentCount} of ${active.target}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onKeyDown={handleKeyDown}
            className="relative mb-6 flex h-64 w-64 cursor-pointer select-none items-center justify-center rounded-full transition-transform active:scale-95"
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <circle
                cx="128"
                cy="128"
                r="118"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-border dark:text-dark-border"
              />
              <circle
                cx="128"
                cy="128"
                r="118"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 118}
                strokeDashoffset={2 * Math.PI * 118 * (1 - progress)}
                className="text-secondary transition-all duration-300"
              />
            </svg>
            <div className="flex flex-col items-center">
              <p className="font-arabic text-3xl leading-relaxed text-text-primary dark:text-dark-text-primary">
                {active.arabic}
              </p>
              <p className="mt-2 text-5xl font-bold text-primary dark:text-secondary-light">
                {currentCount}
              </p>
              <p className="mt-1 text-sm text-text-muted">/ {active.target}</p>
              {currentCount >= active.target && currentCount > 0 && (
                <p className="mt-2 rounded-full bg-success/10 px-3 py-0.5 text-xs font-medium text-success">
                  Completed
                </p>
              )}
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetCurrent}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-alt dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              <BiReset className="text-base" />
              Reset
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-alt dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              <MdLoop className="text-base" />
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
