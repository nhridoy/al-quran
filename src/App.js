import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { About } from "./components/pages/About/About";
import { Credits } from "./components/pages/Credits/Credits";
import { Donation } from "./components/pages/Donation/Donation";
import { Para } from "./components/pages/Para/Para";
import { Paras } from "./components/pages/Paras/Paras";
import { Settings } from "./components/pages/Settings/Settings";
import { Surah } from "./components/pages/Surah/Surah";
import { Surahs } from "./components/pages/Surahs/Surahs";
import { Splash } from "./components/Splash";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-white dark:bg-[#20282e] select-none">
        <div className="container mx-auto px-4 ">
          <Routes>
            <Route path="/" exact element={<Splash />} />
            <Route path="/surah" exact element={<Surahs />} />
            <Route path="/para" exact element={<Paras />} />
            <Route path="/surah/:id" exact element={<Surah />} />
            <Route path="/para/:id" exact element={<Para />} />
            <Route path="/settings" exact element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="*" element={<Navigate to="/surah" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
