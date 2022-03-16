import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Surahs } from "./components/pages/Surahs";
import { Splash } from "./components/Splash";

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" exact element={<Splash />} />
          <Route path="/home" exact element={<Surahs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
