import { FaQuran } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function StepWelcome({
  language,
  onSelect,
}: {
  language: "en" | "bn";
  onSelect: (l: "en" | "bn") => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] shadow-2xl shadow-[#9345f2]/30">
          <FaQuran className="text-3xl text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-white to-[#b87aff] bg-clip-text text-3xl font-bold text-transparent">
          Al Quran
        </h1>
        <p className="text-center text-sm leading-relaxed text-white/50">
          Full Quran with audio, tafsir,
          <br />
          and verse-by-verse recitation
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-white/40">
          Choose Language
        </p>
        <div className="flex gap-3">
          {(
            [
              ["en", "English"],
              ["bn", "বাংলা"],
            ] as const
          ).map(([val, label]) => (
            <Button
              key={val}
              variant="white-ghost"
              className={`flex flex-1 flex-col items-center gap-3 rounded-2xl border p-5 h-auto ${
                language === val
                  ? "border-[#9345f2]/50 bg-[#9345f2]/10 shadow-lg shadow-[#9345f2]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
              onClick={() => onSelect(val)}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg transition-colors ${
                  language === val
                    ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg"
                    : "bg-white/10 text-white/60"
                }`}
              >
                <IoGlobeOutline />
              </div>
              <span
                className={`text-sm font-semibold ${
                  language === val ? "text-white" : "text-white/60"
                }`}
              >
                {label}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
