import React from "react";
import { FaQuran } from "react-icons/fa";
import { BsBoxArrowInRight } from "react-icons/bs";

const ParaList = ({ paraNo }) => {
  return (
    <div className="flex flex-col items-center border-2 rounded-md border-purple-400 hover:bg-purple-600Light dark:hover:bg-[#191f24] active:bg-purple-400 dark:active:bg-[#14191d]">
      <div className="flex flex-col items-center gap-4 p-10">
        <FaQuran className="text-4xl text-primary dark:text-white" />
        <p className="font-semibold dark:text-white">Para {paraNo}</p>
      </div>
      <div className="flex items-center justify-end w-full gap-1 px-3 py-1 text-sm text-gray-600 border-t-2 dark:text-gray-400">
        <p>Read Full Para</p>
        <BsBoxArrowInRight />
      </div>
    </div>
  );
};

export default ParaList;
