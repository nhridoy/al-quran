import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AudioPlayer, { AudioPlayerProvider } from "./components/AudioPlayer";
import LastReadTracker from "./components/LastReadTracker";
import Layout from "./components/Layout/Layout";
import HomeLayout from "./components/pages/HomeLayout";
import Para from "./components/pages/Para/Para";
import SurahPage from "./components/pages/Surah/Surah";

const About = lazy(() => import("./components/pages/About/About"));
const Credits = lazy(() => import("./components/pages/Credits/Credits"));
const Donation = lazy(() => import("./components/pages/Donation/Donation"));
const Paras = lazy(() => import("./components/pages/Paras/Paras"));
const Settings = lazy(() => import("./components/pages/Settings/Settings"));
const Surahs = lazy(() => import("./components/pages/Surahs/Surahs"));
const Splash = lazy(() => import("./components/Splash"));

function App() {
  return (
    <BrowserRouter>
      <AudioPlayerProvider>
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
