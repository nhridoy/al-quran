import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "../Home/Home";
import loadable from "@loadable/component";
const ParaList = loadable(() => import("../ParaList/ParaList"));

const Paras: React.FC = () => {
  useEffect(() => {
    document.title = "Al Quran - Para List";
  }, []);

  const totalPara = 30;

  return (
    <div>
      <Home />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(totalPara)].map((_, index) => (
          <Link key={index + 1} to={`/para/${index + 1}`}>
            <ParaList paraNo={index + 1} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Paras;
