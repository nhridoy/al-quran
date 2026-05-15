import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "../hooks/useSurahs";
import SplashImage from "./SplashImage/SplashImage";

export default function Splash() {
  const { loading } = useSurahs();

  useEffect(() => {
    document.title = "Al Quran";
  }, []);

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold text-primary dark:text-white">
          بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className="text-3xl font-bold text-primary dark:text-white">
          Al Quran
        </h2>
        <p className="text-gray-700 dark:text-gray-400">
          Full Quran with Audio Player
        </p>
      </div>
      <div className="w-full h-full pt-4 pb-10 bg-primary rounded-3xl">
        <div className="grid items-end justify-center w-full h-full">
          <SplashImage />
          <div
            className={`${
              loading ? "cursor-not-allowed" : "cursor-auto"
            } flex items-center justify-center`}
          >
            <Link
              to="/surah"
              className={`${
                loading ? "pointer-events-none" : "pointer-events-auto"
              } text-center bg-alternateSecond px-5 py-2 rounded-2xl text-white font-semibold`}
            >
              {loading ? "Loading Surah Please Wait..." : "Browse Surah"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
