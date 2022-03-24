import React from "react";
import { FaQuran } from "react-icons/fa";
import { BsBoxArrowInRight } from "react-icons/bs";

const ParaList = (props) => {
  const { paraNo } = props;
  return (
    <div className="flex flex-col items-center border-2 rounded-md border-alternateOne hover:bg-secondaryLight dark:hover:bg-[#191f24] active:bg-alternateOne dark:active:bg-[#14191d]">
      <div className="flex flex-col gap-4 p-10 items-center">
        <FaQuran className="text-4xl text-primary dark:text-white" />
        <p className="font-semibold dark:text-white">Para {paraNo}</p>
      </div>
      <div className="flex w-full items-center justify-end gap-1 px-3 py-1 border-t-2 text-sm text-gray-600 dark:text-gray-400">
        <p>Read Full Para</p>
        <BsBoxArrowInRight />
      </div>
    </div>
  );
};

export default ParaList;
