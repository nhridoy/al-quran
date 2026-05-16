import { useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { FaQuran } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSurahs } from "../hooks/useSurahs";
import SplashImage from "./SplashImage/SplashImage";

export default function Splash() {
  const { loading } = useSurahs();

  useEffect(() => {
    document.title = "Al Quran";
  }, []);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-b from-surface via-surface-alt to-surface py-8 dark:from-dark-surface dark:via-dark-surface-alt dark:to-dark-surface">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/5 blur-[120px] dark:bg-secondary/10" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20 size-12">
            <FaQuran className="text-white text-lg" />
          </div>
          <div className="text-center">
            <h1 className="text-gradient font-bold tracking-tight text-4xl">
              Al Quran
            </h1>
            <p className="mt-0.5 text-text-muted dark:text-dark-text-muted text-sm">
              Full Quran with Audio Player
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-linear-to-br from-primary/4 via-secondary/4 to-primary/4 px-6 py-5 dark:from-primary/6 dark:via-secondary/4 dark:to-primary/6">
            <SplashImage />
          </div>
          <p className="font-arabic text-center leading-relaxed text-primary dark:text-secondary-light text-2xl">
            بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            to="/surah"
            className={`group flex items-center gap-2 rounded-xl font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 px-10 py-3.5 text-base ${
              loading
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer bg-linear-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <CgSpinnerTwoAlt className="animate-spin" />
                Loading Surahs...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Start Reading
                <BiChevronRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 text-xs text-text-muted dark:text-dark-text-muted">
            <div className="size-1 rounded-full bg-text-muted" />
            <span>114 Surahs &middot; 30 Paras</span>
            <div className="size-1 rounded-full bg-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
