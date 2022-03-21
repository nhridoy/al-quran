import React from "react";
import { Link } from "react-router-dom";
import { Home } from "../Home/Home";
import { Para } from "../Para/Para";
import { ParaList } from "../ParaList/ParaList";

export const Paras = () => {
  return (
    <div>
      <Home />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link to="/para/1">
          <ParaList />
        </Link>
      </div>
    </div>
  );
};
