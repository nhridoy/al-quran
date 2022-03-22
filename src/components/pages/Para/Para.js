import React, { useEffect } from "react";
import { FaQuran } from "react-icons/fa";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FiOctagon } from "react-icons/fi";
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
        <Header head="Para 1" />
      </div>
      {para.map((para, index) => (
        <ParaHead para={para} key={index} />
      ))}
    </div>
  );
};
