import type { ReactNode } from "react";
import BottomNav from "@/components/common/BottomNav/BottomNav";
import OfflineBanner from "@/components/common/OfflineBanner/OfflineBanner";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import UpdateBanner from "@/components/common/UpdateBanner/UpdateBanner";
import InstallPrompt from "@/components/features/InstallPrompt/InstallPrompt";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="min-h-screen bg-surface text-text-primary dark:bg-dark-surface dark:text-dark-text-primary">
      <Sidebar />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="page-enter">{children}</div>
      </main>
      <OfflineBanner />
      <BottomNav />
      <UpdateBanner />
      <InstallPrompt />
    </div>
  );
}
