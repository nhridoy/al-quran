import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/common/Header/Header";
import { ParaHeader } from "../../components/quran/ParaHeader/ParaHeader";
import { usePara } from "../../hooks/usePara";
import { useSurahs } from "../../hooks/useSurahs";

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
      <Header head={`Para ${id}`} showBack />
      <div className="py-2">
        {para.map((paraItem) => (
          <ParaHeader para={paraItem} key={paraItem.no} allSegments={para} />
        ))}
      </div>
    </div>
  );
}
