import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "../BottomNav/BottomNav";
import InstallPrompt from "../InstallPrompt/InstallPrompt";
import Sidebar from "../Sidebar/Sidebar";
import UpdateBanner from "../UpdateBanner/UpdateBanner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  const location = useLocation();
  const isSplash = location.pathname === "/";

  return (
    <div className="min-h-screen bg-surface text-text-primary dark:bg-dark-surface dark:text-dark-text-primary">
      {!isSplash && <Sidebar />}
      <main
        className={`transition-all duration-300 ${
          isSplash ? "" : "md:ml-64 pb-20 md:pb-0"
        }`}
      >
        <div className="page-enter">{children}</div>
      </main>
      {!isSplash && <BottomNav />}
      {/* {!isSplash && <UpdateBanner />} */}
      {/* {!isSplash && <InstallPrompt />} */}
    </div>
  );
}
