import { Outlet } from "react-router-dom";
import SurahParaNav from "./SurahParaNav";

export default function HomeLayout() {
  return (
    <div>
      <SurahParaNav />
      <Outlet />
    </div>
  );
}
