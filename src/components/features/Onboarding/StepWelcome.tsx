import { useEffect, useState } from "react";
import { FaQuran } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface StepProps {
  appLanguage: "en" | "bn";
  onSelect: (l: "en" | "bn") => void;
}

function FloatingOrbs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-[15%] h-40 w-40 -translate-x-1/2 rounded-full bg-[#9345f2]/10 blur-[60px] animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute left-[20%] top-[40%] h-24 w-24 rounded-full bg-[#b87aff]/8 blur-[40px] animate-pulse"
        style={{ animationDuration: "5s" }}
      />
      <div
        className="absolute right-[20%] top-[35%] h-20 w-20 rounded-full bg-[#2e0d8a]/20 blur-[50px] animate-pulse"
        style={{ animationDuration: "3.5s" }}
      />
    </div>
  );
}

function GlowingQuran({ show }: { show: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute h-36 w-36 rounded-full border border-[#9345f2]/10 transition-all duration-1000 ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        className={`absolute h-28 w-28 rounded-full bg-[#9345f2]/8 blur-sm transition-all duration-1000 delay-150 ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        className={`absolute h-20 w-20 rounded-full bg-[#9345f2]/5 transition-all duration-1000 delay-300 ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] shadow-2xl shadow-[#9345f2]/30 transition-all duration-1000 delay-200 animate-float ${
          show
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-50 translate-y-4 opacity-0"
        }`}
      >
        <FaQuran className="text-3xl text-white" />
      </div>
    </div>
  );
}

export default function StepWelcome({ appLanguage, onSelect }: StepProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 px-2">
      <FloatingOrbs />

      {/* Quran emblem */}
      <GlowingQuran show={show} />

      {/* Title */}
      <div
        className="text-center transition-all duration-1000"
        style={{
          transform: show ? "translateY(0)" : "translateY(24px)",
          opacity: show ? 1 : 0,
          transitionDelay: "500ms",
        }}
      >
        <h1 className="bg-gradient-to-r from-white via-white to-[#b87aff] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Pure
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/35">
          Your daily companion for
          <br />
          faith and reflection
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-48 transition-all duration-700"
        style={{
          transform: show ? "translateY(0)" : "translateY(12px)",
          opacity: show ? 1 : 0,
          transitionDelay: "700ms",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="h-1.5 w-1.5 rotate-45 rounded-sm bg-[#b87aff]/40" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Language selection */}
      <div
        className="w-full max-w-[260px] space-y-3 transition-all duration-700"
        style={{
          transform: show ? "translateY(0)" : "translateY(24px)",
          opacity: show ? 1 : 0,
          transitionDelay: "900ms",
        }}
      >
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
          Choose your language
        </p>
        <div className="flex gap-3">
          {(
            [
              ["en", "English", "EN"],
              ["bn", "বাংলা", "ব"],
            ] as const
          ).map(([val, label, abbr]) => {
            const selected = appLanguage === val;
            return (
              <Button
                key={val}
                variant="white-ghost"
                className={`group relative flex flex-1 flex-col items-center gap-3 overflow-hidden rounded-2xl border py-6 h-auto transition-all duration-400 ${
                  selected
                    ? "border-[#9345f2]/50 bg-[#9345f2]/10 shadow-lg shadow-[#9345f2]/10"
                    : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
                onClick={() => onSelect(val)}
              >
                {selected && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#9345f2]/5 to-transparent" />
                )}

                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl text-lg transition-all duration-400 ${
                    selected
                      ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg shadow-[#9345f2]/20 scale-110"
                      : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:scale-105"
                  }`}
                >
                  <span className="text-sm font-bold">{abbr}</span>
                </div>

                <span
                  className={`text-sm font-semibold transition-colors ${
                    selected
                      ? "text-white"
                      : "text-white/50 group-hover:text-white/70"
                  }`}
                >
                  {label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
