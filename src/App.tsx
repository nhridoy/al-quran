import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AudioPlayer, {
  AudioPlayerProvider,
} from "./components/features/AudioPlayer";
import LastReadTracker from "./components/features/LastReadTracker";
import Onboarding from "./components/features/Onboarding/Onboarding";
import HomeLayout from "./layouts/HomeLayout/HomeLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Para from "./pages/Para/Para";
import SurahPage from "./pages/Surah/Surah";
import { useBookmarkStore } from "./store/bookmarks";
import { useDownloadsStore } from "./store/downloads";
import { useSettings } from "./store/settings";

const About = lazy(() => import("./pages/About/About"));
const AsmaUlHusna = lazy(() => import("./pages/AsmaUlHusna/AsmaUlHusna"));
const Bookmarks = lazy(() => import("./pages/Bookmarks/Bookmarks"));
const Credits = lazy(() => import("./pages/Credits/Credits"));
const Donation = lazy(() => import("./pages/Donation/Donation"));
const Downloads = lazy(() => import("./pages/Downloads/Downloads"));
const Paras = lazy(() => import("./pages/Paras/Paras"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Surahs = lazy(() => import("./pages/Surahs/Surahs"));
const LastTenSurahs = lazy(() => import("./pages/LastTenSurahs/LastTenSurahs"));
const Duas = lazy(() => import("./pages/Duas/Duas"));
const DuaCategory = lazy(() => import("./pages/Duas/DuaCategory"));
const HadithCollections = lazy(
  () => import("./pages/Hadith/HadithCollections"),
);
const HadithBooks = lazy(() => import("./pages/Hadith/HadithBooks"));
const HadithBook = lazy(() => import("./pages/Hadith/HadithBook"));
const PrayerTimes = lazy(() => import("./pages/PrayerTimes/PrayerTimes"));
const QiblaFinder = lazy(() => import("./pages/Qibla/QiblaFinder"));
const Tasbih = lazy(() => import("./pages/Tasbih/Tasbih"));
const Splash = lazy(() => import("./components/features/Splash/Splash"));

function DataLoader() {
  const loadSettings = useSettings((s) => s.load);
  const settingsLoaded = useSettings((s) => s.loaded);
  const loadBookmarks = useBookmarkStore((s) => s.load);
  const bookmarksLoaded = useBookmarkStore((s) => s.loaded);
  const loadDownloads = useDownloadsStore((s) => s.load);
  const downloadsLoaded = useDownloadsStore((s) => s.loaded);
  useEffect(() => {
    if (!settingsLoaded) loadSettings();
    if (!bookmarksLoaded) loadBookmarks();
    if (!downloadsLoaded) loadDownloads();
  }, [
    loadSettings,
    settingsLoaded,
    loadBookmarks,
    bookmarksLoaded,
    loadDownloads,
    downloadsLoaded,
  ]);
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const settingsLoaded = useSettings((s) => s.loaded);
  const onboardingComplete = useSettings((s) => s.onboardingComplete);

  useEffect(() => {
    if (settingsLoaded) {
      setShowOnboarding(!onboardingComplete);
    }
  }, [settingsLoaded, onboardingComplete]);

  return (
    <BrowserRouter>
      <AudioPlayerProvider>
        <DataLoader />
        <ThemeController />
        {showOnboarding && (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        )}
        <MainLayout>
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
              <Route path="/last-ten-surahs" element={<LastTenSurahs />} />
              <Route path="/duas" element={<Duas />} />
              <Route path="/duas/:categoryId" element={<DuaCategory />} />
              <Route path="/hadith" element={<HadithCollections />} />
              <Route path="/hadith/:slug" element={<HadithBooks />} />
              <Route
                path="/hadith/:slug/books/:bookIndex"
                element={<HadithBook />}
              />
              <Route path="/prayer-times" element={<PrayerTimes />} />
              <Route path="/qibla" element={<QiblaFinder />} />
              <Route path="/asma-ul-husna" element={<AsmaUlHusna />} />
              <Route path="/tasbih" element={<Tasbih />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="*" element={<Navigate to="/surah" replace />} />
            </Routes>
          </Suspense>
        </MainLayout>
        <AudioPlayer />
        <LastReadTracker />
      </AudioPlayerProvider>
    </BrowserRouter>
  );
}

export default App;
