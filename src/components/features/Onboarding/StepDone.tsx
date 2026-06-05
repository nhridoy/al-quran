import { useEffect, useState } from "react";
import { FaQuran } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function StepDone({ onFinish }: { onFinish: () => void }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div
        className={`transition-all duration-700 ${pulse ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-2xl shadow-[#22c55e]/30">
          <IoCheckmarkCircle className="text-4xl text-white" />
        </div>
      </div>

      <div
        className={`text-center transition-all duration-700 delay-200 ${pulse ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <h1 className="text-2xl font-bold text-white">You're All Set!</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Al Quran is ready. Your preferences are saved,
          <br />
          and cached data will make everything snappy.
        </p>
      </div>

      <div
        className={`w-full max-w-xs space-y-3 transition-all duration-700 delay-500 ${pulse ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <p className="text-center text-xs text-white/40">
          Everything is cached in IndexedDB for offline-first performance.
        </p>
        <Button
          variant="gradient"
          className="flex w-full items-center justify-center gap-2 py-4 h-auto text-base shadow-lg shadow-[#9345f2]/20 hover:shadow-xl hover:shadow-[#9345f2]/30"
          onClick={onFinish}
        >
          <FaQuran className="text-sm" />
          Start Reading
        </Button>
      </div>
    </div>
  );
}
