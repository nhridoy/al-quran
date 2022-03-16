import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Surah } from "./components/pages/Surah";
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
