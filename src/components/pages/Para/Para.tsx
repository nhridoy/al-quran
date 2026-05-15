import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePara } from "../../../hooks/usePara";
import { useSurahs } from "../../../hooks/useSurahs";
import { Header } from "../../Header/Header";
import { ParaHead } from "../ParaHead/ParaHead";

export default function Para() {
  const { id } = useParams();
  const { surahs } = useSurahs();
  const para = usePara(id, surahs);

  useEffect(() => {
    document.title = `Para - ${id}`;
    window.scrollTo(0, 0);
  }, [id]);

  if (!para) return null;

  return (
    <div>
      <div className="sticky top-0 left-0 z-10 w-full bg-white">
        <Header head={`Para ${id}`} />
      </div>

      {para.map((paraItem) => (
        <ParaHead para={paraItem} key={paraItem.no} allSegments={para} />
      ))}
    </div>
  );
}
