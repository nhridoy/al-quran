import { useEffect, useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export interface ListItem {
  id: string;
  primary: string;
  secondary: string;
  badge?: string;
}

interface ListSelectStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: ListItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}

function SelectedCheck() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#9345f2" opacity="0.15" />
      <circle cx="10" cy="10" r="5" fill="#b87aff" />
      <polyline
        points="7,10 9,12 13,8"
        fill="none"
        stroke="#0a0618"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ListSelectStep({
  icon,
  title,
  description,
  items,
  selectedId,
  onSelect,
  onContinue,
}: ListSelectStepProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex h-full flex-col transition-all duration-700 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Header */}
      <div className="shrink-0 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2]/60 shadow-lg shadow-[#9345f2]/15">
          {icon}
        </div>
        <h2 className="bg-gradient-to-r from-white to-[#b87aff] bg-clip-text text-xl font-bold text-transparent">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-white/35">{description}</p>
      </div>

      {/* Items */}
      <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
        {items.map((item, i) => {
          const selected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                selected
                  ? "border-[#9345f2]/40 bg-[#9345f2]/8 shadow-lg shadow-[#9345f2]/8"
                  : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
              } animate-fade-in-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Initial badge */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                  selected
                    ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg shadow-[#9345f2]/20 scale-110"
                    : "bg-white/5 text-white/40 group-hover:bg-white/10"
                }`}
              >
                {item.primary.charAt(0)}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium transition-colors ${
                    selected ? "text-white" : "text-white/70"
                  }`}
                >
                  {item.primary}
                </p>
                <p className="truncate text-xs text-white/30">
                  {item.secondary}
                </p>
              </div>

              {/* Badge */}
              {item.badge && (
                <span className="shrink-0 rounded-md border border-white/8 bg-white/[0.02] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
                  {item.badge}
                </span>
              )}

              {/* Selection indicator */}
              {selected && <SelectedCheck />}
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <Button
        variant="gradient"
        className="mt-5 flex w-full shrink-0 items-center justify-center gap-2 py-3 h-auto text-sm shadow-lg shadow-[#9345f2]/20 hover:shadow-xl hover:shadow-[#9345f2]/30"
        onClick={onContinue}
      >
        Continue
        <IoChevronForward className="text-base" />
      </Button>
    </div>
  );
}
