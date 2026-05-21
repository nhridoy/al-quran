import {
  AiOutlineCloudDownload,
  AiOutlineGift,
  AiOutlineHeart,
} from "react-icons/ai";
import { BiBook, BiBookmark } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { FaBookOpen, FaQuran, FaStar } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdAccessTime, MdExplore, MdLoop, MdMenuBook } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import HijriDate from "../../features/HijriDate/HijriDate";

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "QURAN",
    items: [
      { to: "/surah", icon: FaBookOpen, label: "Surah" },
      { to: "/para", icon: MdMenuBook, label: "Para" },
      { to: "/last-ten-surahs", icon: FaBookOpen, label: "Last 10 Surahs" },
      { to: "/bookmarks", icon: BiBookmark, label: "Bookmarks" },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { to: "/prayer-times", icon: MdAccessTime, label: "Prayer Times" },
      { to: "/qibla", icon: MdExplore, label: "Qibla Finder" },
      { to: "/asma-ul-husna", icon: FaStar, label: "Asma ul-Husna" },
      { to: "/duas", icon: MdMenuBook, label: "Duas" },
      { to: "/hadith", icon: BiBook, label: "Hadith" },
      { to: "/tasbih", icon: MdLoop, label: "Tasbih" },
      { to: "/downloads", icon: AiOutlineCloudDownload, label: "Downloads" },
    ],
  },
  {
    label: "MORE",
    items: [
      { to: "/settings", icon: IoSettingsOutline, label: "Settings" },
      { to: "/about", icon: BsInfoCircle, label: "About" },
      { to: "/credits", icon: AiOutlineHeart, label: "Credits" },
      { to: "/donation", icon: AiOutlineGift, label: "Donation" },
    ],
  },
];

function isActiveMatch(pathname: string, to: string): boolean {
  if (pathname === to) return true;
  if (to === "/surah" && pathname.startsWith("/surah")) return true;
  if (to === "/para" && pathname.startsWith("/para")) return true;
  return false;
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-surface dark:border-dark-border dark:bg-dark-surface md:flex">
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20">
          <FaQuran className="text-lg text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Al Quran
          </h1>
          <p className="text-xs text-text-muted dark:text-dark-text-muted">
            Read & Listen
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-4 text-[10px] font-semibold uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveMatch(location.pathname, item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-primary/10 to-secondary/10 text-primary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light"
                        : "text-text-secondary hover:bg-surface-alt hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-dark-text-primary"
                    }`}
                  >
                    <Icon
                      className={`text-base ${
                        isActive
                          ? "text-secondary dark:text-secondary-light"
                          : ""
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-linear-to-r from-primary to-secondary" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4 dark:border-dark-border">
        <HijriDate />
      </div>
    </aside>
  );
}

