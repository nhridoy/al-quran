import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Para } from "./components/pages/Para/Para";
import { Surah } from "./components/pages/Surah/Surah";
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
      <div className="bg-white dark:bg-[#20282e] select-none">
        <div className="container px-4 mx-auto ">
          <Suspense fallback={<div className="h-screen"></div>}>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/surah" element={<Surahs />} />
              <Route path="/para" element={<Paras />} />
              <Route path="/surah/:id" element={<Surah />} />
              <Route path="/para/:id" element={<Para />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="*" element={<Navigate to="/surah" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
