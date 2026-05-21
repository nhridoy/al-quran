import type React from "react";
import { BiChevronRight } from "react-icons/bi";
import type { SurahData } from "../../../types";

interface SurahListProps {
  data: SurahData;
}

const SurahList: React.FC<SurahListProps> = ({ data }) => {
  return (
    <div className="group flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-all duration-200">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 font-semibold text-primary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light">
        <span className="text-xs">{data.no}</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            {data.enName}
          </p>
          <p className="truncate text-xs text-text-muted dark:text-dark-text-muted">
            {data.enNameTranslation}
          </p>
        </div>
        <div className="text-right">
          <p className="font-arabic text-lg leading-none text-text-primary dark:text-dark-text-primary">
            {data.name}
          </p>
          <p className="mt-0.5 text-[10px] uppercase text-text-muted dark:text-dark-text-muted">
            {data.revelationType === "Meccan" ? "Makkah" : "Madinah"} &middot;{" "}
            {data.numberOfAyahs}
          </p>
        </div>
      </div>
      <BiChevronRight className="text-lg text-text-muted opacity-0 transition-all duration-200 group-hover:opacity-100 dark:text-dark-text-muted" />
    </div>
  );
};

export default SurahList;




