import { useEffect } from "react";
import { Link } from "react-router-dom";
import ParaItem from "../../components/quran/ParaItem/ParaItem";

export default function Paras() {
  useEffect(() => {
    document.title = "Al Quran - Para List";
  }, []);

  return (
    <div>
      <div className="mx-4 grid grid-cols-2 gap-3 md:mx-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
          <Link key={num} to={`/para/${num}`}>
            <ParaItem paraNo={num} />
          </Link>
        ))}
      </div>
    </div>
  );
}
