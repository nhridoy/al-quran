import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { About } from "./components/pages/About/About";
import { Credits } from "./components/pages/Credits/Credits";
import { Donation } from "./components/pages/Donation/Donation";
import { Settings } from "./components/pages/Settings/Settings";
import { Surah } from "./components/pages/Surah/Surah";
import { Surahs } from "./components/pages/Surahs";
import { Splash } from "./components/Splash";

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" exact element={<Splash />} />
          <Route path="/surah" exact element={<Surahs />} />
          <Route path="/surah/:id" exact element={<Surah />} />
          <Route path="/settings" exact element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/donation" element={<Donation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
