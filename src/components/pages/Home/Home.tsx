import { NavLink } from "react-router-dom";
import { Header } from "../../Header/Header";
import { SurahsHead } from "../Surahs/SurahsHead";

export const Home = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-semibold py-4 flex items-center justify-center border-b-2 transition-colors ${
      isActive
        ? "text-primary dark:text-white border-primary dark:border-secondary bg-white dark:bg-[#191f24]"
        : "text-gray-400 border-b-gray-400"
    }`;

  return (
    <div className="bg-white dark:bg-[#20282e] sticky top-0 left-0 w-full z-10">
      <Header head="Al Quran" />
      <SurahsHead />
      <div className="grid grid-cols-2 my-3">
        <NavLink to="/surah" end className={linkClass}>
          Surah
        </NavLink>
        <NavLink to="/para" end className={linkClass}>
          Para
        </NavLink>
      </div>
    </div>
  );
};
