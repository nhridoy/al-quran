import { NavLink } from "react-router-dom";
import { Header } from "../../Header/Header";
import { SurahsHead } from "../Surahs/SurahsHead";

export const Home = () => {
  return (
    <div>
      <Header head="Al Quran" />
      <SurahsHead />
      <div className="mx-4 mb-6 flex rounded-xl bg-surface-alt p-1 dark:bg-dark-surface-alt md:mx-6">
        <NavLink
          to="/surah"
          end
          className={({ isActive }) =>
            `flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-white text-primary shadow-sm dark:bg-dark-surface-card dark:text-secondary-light"
                : "text-text-muted hover:text-text-primary dark:text-dark-text-muted dark:hover:text-dark-text-primary"
            }`
          }
        >
          Surah
        </NavLink>
        <NavLink
          to="/para"
          end
          className={({ isActive }) =>
            `flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-white text-primary shadow-sm dark:bg-dark-surface-card dark:text-secondary-light"
                : "text-text-muted hover:text-text-primary dark:text-dark-text-muted dark:hover:text-dark-text-primary"
            }`
          }
        >
          Para
        </NavLink>
      </div>
    </div>
  );
};
