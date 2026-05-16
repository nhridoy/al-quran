import type React from "react";
import { BiChevronRight } from "react-icons/bi";
import { FaQuran } from "react-icons/fa";

interface ParaListProps {
  paraNo: number;
}

const ParaList: React.FC<ParaListProps> = ({ paraNo }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 card-hover dark:border-dark-border dark:bg-dark-surface-card">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
      <div className="p-5">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20">
          <FaQuran className="text-xl text-white" />
        </div>
        <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
          Para {paraNo}
        </h3>
        <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
          Juz {paraNo}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-3 dark:border-dark-border">
        <span className="text-xs font-medium text-text-secondary dark:text-dark-text-secondary">
          Read Full Para
        </span>
        <BiChevronRight className="text-sm text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 dark:text-dark-text-muted" />
      </div>
    </div>
  );
};

export default ParaList;
