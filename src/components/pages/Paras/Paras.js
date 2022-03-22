import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { paraCreation } from "../../../utilities/paraCreation";
import { Home } from "../Home/Home";
import { Para } from "../Para/Para";
import { ParaList } from "../ParaList/ParaList";

export const Paras = (props) => {
  //   console.log("Paras.js: props: ", props);

  const totalPara = 30;

  return (
    <div>
      <Home />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(totalPara)].map((_, index) => (
          <Link
            // paraDetails={
            //   Object.keys(totalParaList).length && totalParaList[index + 1]
            // }
            key={index + 1}
            to={`/para/${index + 1}`}
          >
            <ParaList paraNo={index + 1} />
          </Link>
        ))}
      </div>
    </div>
  );
};
