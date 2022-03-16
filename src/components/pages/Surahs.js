import React from "react";
import { BsOctagon } from "react-icons/bs";

export const Surahs = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex md:flex-col justify-between items-center md:items-end gap-4 border-b-2">
        <div className="flex gap-4">
          <div className="flex gap-3 items-center">
            <div className="">
              <BsOctagon />
              <span>1</span>
            </div>
            <div className="flex flex-col">
              <div className="name">Fatiha</div>
              <div className="flex gap-2 text-gray-600">
                <p>Text</p>
                <p>Text</p>
              </div>
            </div>
          </div>
        </div>
        <div className="">Arbi</div>
      </div>
    </div>
  );
};
