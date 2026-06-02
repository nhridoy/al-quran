import { useCallback, useEffect, useRef, useState } from "react";
import { BiReset } from "react-icons/bi";
import { MdLoop } from "react-icons/md";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { loadCounts, PRESETS, saveCounts } from "@/lib/tasbih";
import CircularCounter, { CounterContent } from "./CircularCounter";

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
    <PageShell
      head="Tasbih"
      showBack
      title="Tasbih Counter"
      description="Tap to count. Long-press to reset."
      className="space-y-0"
    >
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PRESETS.map((dhikr) => (
          <Button
            key={dhikr.id}
            onClick={() => setActiveId(dhikr.id)}
            variant={activeId === dhikr.id ? "gradient" : "secondary-ghost"}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeId === dhikr.id
                ? "shadow-md"
                : "border border-border bg-surface hover:bg-surface-alt dark:border-dark-border dark:bg-dark-surface-card dark:hover:bg-dark-surface-alt"
            }`}
          >
            {dhikr.label} ({dhikr.target})
          </Button>
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
          <CircularCounter progress={progress} />
          <CounterContent
            arabic={active.arabic}
            count={currentCount}
            target={active.target}
          />
        </button>

        <div className="flex items-center gap-3">
          <Button
            onClick={resetCurrent}
            variant="secondary-ghost"
            className="gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-alt dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
          >
            <BiReset className="text-base" />
            Reset
          </Button>
          <Button
            onClick={resetAll}
            variant="secondary-ghost"
            className="gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-alt dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
          >
            <MdLoop className="text-base" />
            Reset All
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
