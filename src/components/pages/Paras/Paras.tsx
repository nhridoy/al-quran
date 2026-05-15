import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "../Home/Home";
import ParaList from "../ParaList/ParaList";

const Paras: React.FC = () => {
  useEffect(() => {
    document.title = "Al Quran - Para List";
  }, []);

  const totalPara = 30;

  return (
    <div>
      <Home />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[...new Array(totalPara)].map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <Ignore>
          <Link key={index + 1} to={`/para/${index + 1}`}>
            <ParaList paraNo={index + 1} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Paras;
