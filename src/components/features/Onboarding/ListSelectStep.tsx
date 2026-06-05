import { IoCheckmarkCircle, IoChevronForward } from "react-icons/io5";
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

export default function ListSelectStep({
  icon,
  title,
  description,
  items,
  selectedId,
  onSelect,
  onContinue,
}: ListSelectStepProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2]/60 shadow-lg">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-center text-sm text-white/50">{description}</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="divide-y divide-white/5">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="white-ghost"
              className={`flex w-full items-center gap-4 px-4 py-3.5 h-auto rounded-none justify-start ${
                selectedId === item.id ? "bg-[#9345f2]/10" : ""
              }`}
              onClick={() => onSelect(item.id)}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  selectedId === item.id
                    ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {item.primary.charAt(0)}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    selectedId === item.id ? "text-white" : "text-white/70"
                  }`}
                >
                  {item.primary}
                </p>
                <p className="text-xs text-white/40">{item.secondary}</p>
              </div>
              {item.badge && (
                <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                  {item.badge}
                </span>
              )}
              {selectedId === item.id && (
                <IoCheckmarkCircle className="text-lg text-[#b87aff]" />
              )}
            </Button>
          ))}
        </div>
      </div>

      <Button
        variant="gradient"
        className="flex w-full items-center justify-center gap-2 py-3.5 h-auto text-sm shadow-lg shadow-[#9345f2]/20 hover:shadow-xl hover:shadow-[#9345f2]/30"
        onClick={onContinue}
      >
        Continue
        <IoChevronForward className="text-base" />
      </Button>
    </div>
  );
}
