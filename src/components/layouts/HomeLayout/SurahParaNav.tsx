import { NavLink } from "react-router-dom";
import { Header } from "@/components/common/Header/Header";
import LastReadBanner from "@/components/quran/LastReadBanner/LastReadBanner";

export default function SurahParaNav() {
  return (
    <div>
      <Header head="Pure" />
      <LastReadBanner />
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
}
