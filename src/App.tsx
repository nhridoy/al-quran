import { Analytics } from "@vercel/analytics/react";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSS_VAR_ARABIC_FONT, CSS_VAR_TRANSLATION_FONT } from "@/lib/const";
import { isRamadan as isRamadanMonth } from "@/lib/date";
import type { RouteDefinition } from "@/lib/routes";
import ConfirmModal from "./components/common/ConfirmModal/ConfirmModal";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import AudioPlayer from "./components/features/AudioPlayer";
import AudioEngineShell from "./components/features/AudioPlayer/AudioEngineShell";
import LastReadTracker from "./components/features/LastReadTracker";
import Onboarding from "./components/features/Onboarding/Onboarding";
import HomeLayout from "./components/layouts/HomeLayout/HomeLayout";
import MainLayout from "./components/layouts/MainLayout/MainLayout";
import { LocaleProvider, useLocale } from "./i18n";
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
const HijriCalendar = lazy(() => import("./pages/HijriCalendar"));
const FastingCalendar = lazy(() => import("./pages/FastingCalendar"));
const DailyLog = lazy(() => import("./pages/DailyLog"));
const PrayerTracker = lazy(() => import("./pages/PrayerTracker"));
const ZakatCalculator = lazy(() => import("./pages/ZakatCalculator"));
const SadaqahTracker = lazy(() => import("./pages/SadaqahTracker"));
const SalahGuide = lazy(() => import("./pages/SalahGuide"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const IslamicNames = lazy(() => import("./pages/IslamicNames"));
const ReadingGoals = lazy(() => import("./pages/ReadingGoals"));
const DataExport = lazy(() => import("./pages/DataExport"));
const TaraweehTracker = lazy(() => import("./pages/TaraweehTracker"));
const Home = lazy(() => import("./pages/Home"));

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
  { path: "/daily-log", component: DailyLog },
  { path: "/prayer-tracker", component: PrayerTracker },
  { path: "/fasting-calendar", component: FastingCalendar },
  { path: "/sadaqah-tracker", component: SadaqahTracker },
  { path: "/zakat-calculator", component: ZakatCalculator },
  { path: "/hijri-calendar", component: HijriCalendar },
  { path: "/salah-guide", component: SalahGuide },
  { path: "/knowledge", component: Knowledge },
  { path: "/islamic-names", component: IslamicNames },
  { path: "/reading-goals", component: ReadingGoals },
  { path: "/data-export", component: DataExport },
  { path: "/taraweeh-tracker", component: TaraweehTracker },
];

function DataLoader() {
  const loadSettings = useSettings((s) => s.load);
  const settingsLoaded = useSettings((s) => s.loaded);
  const onboardingComplete = useSettings((s) => s.onboardingComplete);
  const requestLocation = useLocationStore((s) => s.request);
  const locationRequested = useLocationStore((s) => s.requested);
  const loadLocation = useLocationStore((s) => s.load);
  const locationLoaded = useLocationStore((s) => s.loaded);
  const loadBookmarks = useBookmarkStore((s) => s.load);
  const bookmarksLoaded = useBookmarkStore((s) => s.loaded);
  const loadDownloads = useDownloadsStore((s) => s.load);
  const downloadsLoaded = useDownloadsStore((s) => s.loaded);
  useEffect(() => {
    if (!settingsLoaded) loadSettings();
    if (!bookmarksLoaded) loadBookmarks();
    if (!downloadsLoaded) loadDownloads();
    if (settingsLoaded && !locationLoaded) loadLocation();
  }, [
    loadSettings,
    settingsLoaded,
    loadBookmarks,
    bookmarksLoaded,
    loadDownloads,
    downloadsLoaded,
    loadLocation,
    locationLoaded,
  ]);
  useEffect(() => {
    if (
      settingsLoaded &&
      onboardingComplete &&
      !locationRequested &&
      locationLoaded
    ) {
      requestLocation();
    }
  }, [
    settingsLoaded,
    onboardingComplete,
    locationRequested,
    locationLoaded,
    requestLocation,
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

function LocaleSync() {
  const localeSetting = useSettings((s) => s.locale);
  const { setLocale } = useLocale();
  useEffect(() => {
    setLocale(localeSetting);
  }, [localeSetting, setLocale]);
  return null;
}

function RamadanModeController() {
  const ramadanMode = useSettings((s) => s.ramadanMode);
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const [isRamadan, setIsRamadan] = useState(false);

  useEffect(() => {
    if (ramadanMode === "off") {
      setIsRamadan(false);
      return;
    }
    if (ramadanMode === "on") {
      setIsRamadan(true);
      return;
    }
    setIsRamadan(isRamadanMonth(new Date(), hijriAdjust));
  }, [ramadanMode, hijriAdjust]);

  useEffect(() => {
    document.documentElement.classList.toggle("ramadan-mode", isRamadan);
  }, [isRamadan]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    void pathname;
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const settingsLoaded = useSettings((s) => s.loaded);
  const onboardingComplete = useSettings((s) => s.onboardingComplete);

  useEffect(() => {
    if (settingsLoaded) {
      setShowOnboarding(!onboardingComplete);
    }
  }, [settingsLoaded, onboardingComplete]);

  return (
    <>
      <DataLoader />
      <ThemeController />
      <LocaleSync />
      <RamadanModeController />
      <ScrollToTop />
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <MainLayout>
        <ErrorBoundary key={location.pathname + location.search}>
          <Suspense fallback={<div className="h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
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
    </>
  );
}

function App() {
  const locale = useSettings((s) => s.locale);

  return (
    <BrowserRouter>
      <TooltipProvider>
        <LocaleProvider initialLocale={locale}>
          <AppContent />
        </LocaleProvider>
      </TooltipProvider>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
