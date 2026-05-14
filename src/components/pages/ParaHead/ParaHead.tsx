import loadable from "@loadable/component";
import type React from "react";
import { FiOctagon } from "react-icons/fi";
import { useParams } from "react-router-dom";
import type { ParaSurah } from "../../../types";

const Ayahs = loadable(() => import("../Ayahs/Ayahs"));

interface ParaHeadProps {
  para: ParaSurah;
}

export const ParaHead: React.FC<ParaHeadProps> = ({ para }) => {
  const { id } = useParams();
  return (
    <div className="">
      <div className="sticky flex justify-between p-4 text-white rounded-lg top-24 bg-secondary">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiOctagon className="text-4xl font-bold" />
            <span className="absolute inset-0 grid font-semibold place-items-center">
              {para.no}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold md:text-lg">{para.enName}</div>
            <div className="flex flex-col gap-1 text-xs">
              <span className="flex gap-1">
                {para.revelationType === "Meccan" ? (
                  <img
                    src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png"
                    alt="Meccan"
                  />
                ) : (
                  <img
                    src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png"
                    alt="Medinan"
                  />
                )}
                <span className="uppercase">{para.revelationType}</span>
              </span>
              <span className="uppercase">
                {para.verses.length} verses in para {id}
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-right md:text-lg">
          <p className=" md:font-semibold">{para.name}</p>
          <p>{para.enNameTranslation}</p>
          <p>{para.bnNameTranslation}</p>
        </div>
      </div>
      {para.verses.map((verse) => (
        <Ayahs ayah={verse} key={`${verse.numberInSurah} + ${verse.juz}`} />
      ))}
    </div>
  );
};
