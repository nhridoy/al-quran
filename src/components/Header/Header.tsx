import type React from "react";
import { BiArrowBack } from "react-icons/bi";
import type { SurahData } from "../../types";
import Search from "../Search/Search";

interface HeaderProps {
  head?: string;
  surah?: SurahData;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const handleBackBtn = () => {
    window.history.back();
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-30 bg-surface/80 backdrop-blur-xl dark:bg-dark-surface/80 md:relative md:bg-transparent md:backdrop-blur-none md:dark:bg-transparent">
      <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-3">
          {props.showBack && (
            <button
              type="button"
              onClick={handleBackBtn}
              className="btn-ghost flex items-center justify-center rounded-xl p-2"
              aria-label="Go back"
            >
              <BiArrowBack className="text-xl" />
            </button>
          )}
          <h1 className="text-lg font-bold text-text-primary dark:text-dark-text-primary md:text-xl">
            {!props.head ? props.surah?.enName : props.head}
          </h1>
        </div>
        <Search />
      </div>
    </header>
  );
};
