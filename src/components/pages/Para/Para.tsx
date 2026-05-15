import type React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ParaSurah } from "../../../types";
import { paraCreation } from "../../../utilities/paraCreation";
import { Header } from "../../Header/Header";
import { ParaHead } from "../ParaHead/ParaHead";

export const Para: React.FC = () => {
  const { id } = useParams();

  useEffect(() => {
    document.title = `Para - ${id}`;
    window.scrollTo(0, 0);
  }, [id]);

  const paraDetails = paraCreation();
  const para: ParaSurah[] | undefined = id ? paraDetails[id] : undefined;

  return (
    <div className="">
      <div className="sticky top-0 left-0 z-10 w-full bg-white">
        <Header head={`Para ${id}`} />
      </div>

      {para?.map((paraItem) => (
        <ParaHead para={paraItem} key={paraItem.no} allSegments={para} />
      ))}
    </div>
  );
};
