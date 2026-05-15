import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "../Home/Home";
import ParaList from "../ParaList/ParaList";

export default function Paras() {
  useEffect(() => {
    document.title = "Al Quran - Para List";
  }, []);

  return (
    <div>
      <Home />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
          <Link key={num} to={`/para/${num}`}>
            <ParaList paraNo={num} />
          </Link>
        ))}
      </div>
    </div>
  );
}
