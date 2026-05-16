import { AiOutlineGift } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

const tabs = [
  { to: "/surah", icon: FaBookOpen, label: "Surah" },
  { to: "/para", icon: MdMenuBook, label: "Para" },
  { to: "/settings", icon: IoSettingsOutline, label: "Settings" },
  { to: "/about", icon: BsInfoCircle, label: "About" },
  { to: "/donation", icon: AiOutlineGift, label: "Donate" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/80 backdrop-blur-xl dark:border-dark-border dark:bg-dark-surface/80 md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            location.pathname === tab.to ||
            (tab.to === "/surah" && location.pathname.startsWith("/surah")) ||
            (tab.to === "/para" && location.pathname.startsWith("/para"));

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
                    ? "bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20"
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
      </div>
    </nav>
  );
}
