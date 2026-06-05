import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSS_VAR_ARABIC_FONT, CSS_VAR_TRANSLATION_FONT } from "@/lib/const";
import type { RouteDefinition } from "@/lib/routes";
import ConfirmModal from "./components/common/ConfirmModal/ConfirmModal";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import AudioPlayer from "./components/features/AudioPlayer";
import AudioEngineShell from "./components/features/AudioPlayer/AudioEngineShell";
import LastReadTracker from "./components/features/LastReadTracker";
import Onboarding from "./components/features/Onboarding/Onboarding";
import HomeLayout from "./components/layouts/HomeLayout/HomeLayout";
import MainLayout from "./components/layouts/MainLayout/MainLayout";
import Para from "./pages/Para/[id]";
import SurahPage from "./pages/Surah/[id]";
import { useBookmarkStore } from "./store/bookmarks";
import { useDownloadsStore } from "./store/downloads";
import { useLocationStore } from "./store/location";
import { useSettings } from "./store/settings";

const About = lazy(() => import("./pages/About"));
const AsmaUlHusna = lazy(() => import("./pages/AsmaUlHusna"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Credits = lazy(() => import("./pages/Credits"));
const Donation = lazy(() => import("./pages/Donation"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Paras = lazy(() => import("./pages/Para"));
const Settings = lazy(() => import("./pages/Settings"));
const Surahs = lazy(() => import("./pages/Surah"));
const LastTenSurahs = lazy(() => import("./pages/LastTenSurahs"));
const Duas = lazy(() => import("./pages/Duas"));
const DuaCategory = lazy(() => import("./pages/Duas/[category]"));
const HadithCollections = lazy(() => import("./pages/Hadith"));
const HadithBooks = lazy(() => import("./pages/Hadith/[collection]"));
const HadithBook = lazy(() => import("./pages/Hadith/[collection]/[bookId]"));
const PrayerTimes = lazy(() => import("./pages/PrayerTimes"));
const QiblaFinder = lazy(() => import("./pages/Qibla"));
const Tasbih = lazy(() => import("./pages/Tasbih"));
const Splash = lazy(() => import("./components/features/Splash/Splash"));

const routeDefinitions: RouteDefinition[] = [
  { path: "/bookmarks", component: Bookmarks },
  { path: "/last-ten-surahs", component: LastTenSurahs },
  { path: "/duas", component: Duas },
  { path: "/duas/:categoryId", component: DuaCategory },
  { path: "/hadith", component: HadithCollections },
  { path: "/hadith/:slug", component: HadithBooks },
  { path: "/hadith/:slug/books/:bookIndex", component: HadithBook },
  { path: "/prayer-times", component: PrayerTimes },
  { path: "/qibla", component: QiblaFinder },
  { path: "/asma-ul-husna", component: AsmaUlHusna },
  { path: "/tasbih", component: Tasbih },
  { path: "/settings", component: Settings },
  { path: "/about", component: About },
  { path: "/credits", component: Credits },
  { path: "/downloads", component: Downloads },
  { path: "/donation", component: Donation },
];

function DataLoader() {
  const loadSettings = useSettings((s) => s.load);
  const settingsLoaded = useSettings((s) => s.loaded);
  const onboardingComplete = useSettings((s) => s.onboardingComplete);
  const requestLocation = useLocationStore((s) => s.request);
  const locationRequested = useLocationStore((s) => s.requested);
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
  useEffect(() => {
    if (settingsLoaded && onboardingComplete && !locationRequested) {
      requestLocation();
    }
  }, [settingsLoaded, onboardingComplete, locationRequested, requestLocation]);
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
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);

    document.documentElement.style.setProperty(
      CSS_VAR_ARABIC_FONT,
      `${arabicFontSize}rem`,
    );
    document.documentElement.style.setProperty(
      CSS_VAR_TRANSLATION_FONT,
      `${translationFontSize}rem`,
    );
  }, [theme, arabicFontSize, translationFontSize]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = globalThis.matchMedia("(prefers-color-scheme: dark)");
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
      <TooltipProvider>
        <DataLoader />
        <ThemeController />
        {showOnboarding && (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        )}
        <MainLayout>
          <ErrorBoundary>
            <Suspense fallback={<div className="h-screen" />}>
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route element={<HomeLayout />}>
                  <Route path="/surah" element={<Surahs />} />
                  <Route path="/para" element={<Paras />} />
                </Route>
                <Route path="/surah/:id" element={<SurahPage />} />
                <Route path="/para/:id" element={<Para />} />
                {routeDefinitions.map((r) => (
                  <Route key={r.path} path={r.path} element={<r.component />} />
                ))}
                <Route path="*" element={<Navigate to="/surah" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </MainLayout>
        <AudioEngineShell />
        <AudioPlayer />
        <LastReadTracker />
        <ConfirmModal />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
