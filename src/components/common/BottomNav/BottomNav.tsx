import { useState } from "react";
import {
  AiOutlineCloudDownload,
  AiOutlineGift,
  AiOutlineHeart,
} from "react-icons/ai";
import { BiBook, BiBookmark } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { FaBookOpen, FaStar } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdAccessTime, MdExplore, MdLoop, MdMenuBook } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import Drawer from "../../common/Drawer/Drawer";

interface Tab {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const primaryTabs: Tab[] = [
  { to: "/surah", icon: FaBookOpen, label: "Surah" },
  { to: "/para", icon: MdMenuBook, label: "Para" },
  { to: "/prayer-times", icon: MdAccessTime, label: "Prayer" },
  { to: "/tasbih", icon: MdLoop, label: "Tasbih" },
];

const overflowTabs: Tab[] = [
  { to: "/bookmarks", icon: BiBookmark, label: "Bookmarks" },
  { to: "/last-ten-surahs", icon: FaBookOpen, label: "Last 10" },
  { to: "/asma-ul-husna", icon: FaStar, label: "Asma ul-Husna" },
  { to: "/duas", icon: MdMenuBook, label: "Duas" },
  { to: "/qibla", icon: MdExplore, label: "Qibla Finder" },
  { to: "/hadith", icon: BiBook, label: "Hadith" },
  { to: "/downloads", icon: AiOutlineCloudDownload, label: "Downloads" },
  { to: "/settings", icon: IoSettingsOutline, label: "Settings" },
  { to: "/about", icon: BsInfoCircle, label: "About" },
  { to: "/credits", icon: AiOutlineHeart, label: "Credits" },
  { to: "/donation", icon: AiOutlineGift, label: "Donate" },
];

function isActiveMatch(pathname: string, to: string): boolean {
  if (pathname === to) return true;
  if (to === "/surah" && pathname.startsWith("/surah")) return true;
  if (to === "/para" && pathname.startsWith("/para")) return true;
  return false;
}

export default function BottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/80 backdrop-blur-xl dark:border-dark-border dark:bg-dark-surface/80 md:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveMatch(location.pathname, tab.to);

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200 ${
                  isActive
                    ? "text-secondary dark:text-secondary-light"
                    : "text-text-muted dark:text-dark-text-muted"
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-lg p-1.5 transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20"
                      : ""
                  }`}
                >
                  <Icon className="text-lg" />
                </div>
                <span className="text-[10px] font-medium leading-tight">
                  {tab.label}
                </span>
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer ${
              moreOpen
                ? "text-secondary dark:text-secondary-light"
                : "text-text-muted dark:text-dark-text-muted"
            }`}
          >
            <div className="flex items-center justify-center rounded-lg p-1.5">
              <HiDotsHorizontal className="text-lg" />
            </div>
            <span className="text-[10px] font-medium leading-tight">More</span>
          </button>
        </div>
      </nav>

      <Drawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        direction="bottom"
        className="bg-surface pb-8 dark:bg-dark-surface"
      >
        <div className="p-4">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border dark:bg-dark-border" />
          <h3 className="mb-3 text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            More
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {overflowTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = isActiveMatch(location.pathname, tab.to);

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  onClick={() => setMoreOpen(false)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-br from-primary/10 to-secondary/10 text-secondary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light"
                      : "text-text-muted hover:bg-surface-alt hover:text-text-primary dark:hover:bg-dark-surface-alt dark:hover:text-dark-text-primary"
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="text-[10px] font-medium leading-tight text-center">
                    {tab.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </Drawer>
    </>
  );
}
