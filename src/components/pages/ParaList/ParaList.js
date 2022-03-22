import React from "react";
import { FaQuran } from "react-icons/fa";
import { BsBoxArrowInRight } from "react-icons/bs";

export const ParaList = (props) => {
  const { paraNo } = props;
  return (
    <div className="flex flex-col items-center border-2 rounded-md border-alternateOne hover:bg-secondaryLight active:bg-alternateOne">
      <div className="flex flex-col gap-4 p-10 items-center">
        <FaQuran className="text-4xl text-primary" />
        <p className="font-semibold">Para {paraNo}</p>
      </div>
      <div className="flex w-full items-center justify-end gap-1 px-3 py-1 border-t-2 text-sm text-gray-600">
        <p>Read Full Para</p>
        <BsBoxArrowInRight />
      </div>
    </div>
  );
};
