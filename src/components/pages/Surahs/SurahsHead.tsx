import type React from "react";
import { useEffect, useState } from "react";
import { FaQuran } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";

interface ReadStatus {
  surahName: string;
  verseNumber: number;
}

export const SurahsHead: React.FC = () => {
  const [readStatus, setReadStatus] = useState<ReadStatus | null>(null);
  useEffect(() => {
    const currentAudioIndex: ReadStatus | null = JSON.parse(
      localStorage.getItem("currentAudioIndex") || "null",
    );
    setReadStatus(currentAudioIndex);
  }, []);

  return (
    <div className="relative mx-4 mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary-light to-secondary p-6 text-white shadow-xl shadow-primary/20 md:mx-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
      <div className="relative flex items-center justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white/70">
              Assalamualaikum...!!
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
              <MdMenuBook className="text-sm" />
              <span>Last Read</span>
            </div>
          </div>
          <div>
            <p className="text-base font-semibold">
              {readStatus ? readStatus.surahName : "No reading history"}
            </p>
            <p className="text-sm text-white/70">
              {readStatus
                ? `Ayah ${readStatus.verseNumber}`
                : "Start reading to track progress"}
            </p>
          </div>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <FaQuran className="text-2xl text-white/80" />
        </div>
      </div>
    </div>
  );
};
