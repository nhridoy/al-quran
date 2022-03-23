import React, { useEffect } from "react";
import { Header } from "../../Header/Header";
import { useParams } from "react-router-dom";
import { ParaHead } from "../ParaHead/ParaHead";
import { paraCreation } from "../../../utilities/paraCreation";

export const Para = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const paraDetails = paraCreation();
  const { id } = useParams();
  const para = paraDetails[id];
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);
  return (
    <div className="">
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head={`Para ${id}`} />
      </div>
      {para.map((para, index) => (
        <ParaHead para={para} key={index} />
      ))}
    </div>
  );
};
