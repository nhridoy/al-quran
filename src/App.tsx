import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AudioPlayer, { AudioPlayerProvider } from "./components/AudioPlayer";
import LastReadTracker from "./components/LastReadTracker";
import Layout from "./components/Layout/Layout";
import HomeLayout from "./components/pages/HomeLayout";
import Para from "./components/pages/Para/Para";
import SurahPage from "./components/pages/Surah/Surah";
import { useBookmarkStore } from "./store/bookmarks";
import { useSettings } from "./store/settings";

const About = lazy(() => import("./components/pages/About/About"));
const AsmaUlHusna = lazy(
  () => import("./components/pages/AsmaUlHusna/AsmaUlHusna"),
);
const Bookmarks = lazy(() => import("./components/pages/Bookmarks/Bookmarks"));
const Credits = lazy(() => import("./components/pages/Credits/Credits"));
const Donation = lazy(() => import("./components/pages/Donation/Donation"));
const Paras = lazy(() => import("./components/pages/Paras/Paras"));
const Settings = lazy(() => import("./components/pages/Settings/Settings"));
const Surahs = lazy(() => import("./components/pages/Surahs/Surahs"));
const Tasbih = lazy(() => import("./components/pages/Tasbih/Tasbih"));
const Splash = lazy(() => import("./components/Splash"));

function DataLoader() {
  const loadSettings = useSettings((s) => s.load);
  const settingsLoaded = useSettings((s) => s.loaded);
  const loadBookmarks = useBookmarkStore((s) => s.load);
  const bookmarksLoaded = useBookmarkStore((s) => s.loaded);
  useEffect(() => {
    if (!settingsLoaded) loadSettings();
    if (!bookmarksLoaded) loadBookmarks();
  }, [loadSettings, settingsLoaded, loadBookmarks, bookmarksLoaded]);
  return null;
}

function ThemeController() {
  const theme = useSettings((s) => s.theme);
  const arabicFontSize = useSettings((s) => s.arabicFontSize);
  const translationFontSize = useSettings((s) => s.translationFontSize);

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);

    document.documentElement.style.setProperty(
      "--arabic-font-size",
      `${arabicFontSize}rem`,
    );
    document.documentElement.style.setProperty(
      "--translation-font-size",
      `${translationFontSize}rem`,
    );
  }, [theme, arabicFontSize, translationFontSize]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AudioPlayerProvider>
        <DataLoader />
        <ThemeController />
        <Layout>
          <Suspense fallback={<div className="h-screen" />}>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route element={<HomeLayout />}>
                <Route path="/surah" element={<Surahs />} />
                <Route path="/para" element={<Paras />} />
              </Route>
              <Route path="/surah/:id" element={<SurahPage />} />
              <Route path="/para/:id" element={<Para />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/asma-ul-husna" element={<AsmaUlHusna />} />
              <Route path="/tasbih" element={<Tasbih />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="*" element={<Navigate to="/surah" replace />} />
            </Routes>
          </Suspense>
        </Layout>
        <AudioPlayer />
        <LastReadTracker />
      </AudioPlayerProvider>
    </BrowserRouter>
  );
}

export default App;
