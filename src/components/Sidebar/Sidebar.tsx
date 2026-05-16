import { AiOutlineGift, AiOutlineHeart } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { FaBookOpen, FaQuran } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/surah", icon: FaBookOpen, label: "Surah" },
  { to: "/para", icon: MdMenuBook, label: "Para" },
  { to: "/settings", icon: IoSettingsOutline, label: "Settings" },
  { to: "/about", icon: BsInfoCircle, label: "About" },
  { to: "/credits", icon: AiOutlineHeart, label: "Credits" },
  { to: "/donation", icon: AiOutlineGift, label: "Donation" },
];

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

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to === "/surah" && location.pathname.startsWith("/surah")) ||
            (item.to === "/para" && location.pathname.startsWith("/para"));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-linear-to-r from-primary/10 to-secondary/10 text-primary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light"
                  : "text-text-secondary hover:bg-surface-alt hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-dark-text-primary"
              }`}
            >
              <Icon
                className={`text-lg ${
                  isActive ? "text-secondary dark:text-secondary-light" : ""
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-linear-to-r from-primary to-secondary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-6 dark:border-dark-border">
        <div className="rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 p-4 dark:from-primary/10 dark:to-secondary/10">
          <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted">
            Quranic Verse
          </p>
          <p className="mt-1 text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            "Read! In the Name of your Lord"
          </p>
          <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
            Al-Alaq 96:1
          </p>
        </div>
      </div>
    </aside>
  );
}
