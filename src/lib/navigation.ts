import type { ComponentType } from "react";
import {
  AiOutlineCloudDownload,
  AiOutlineGift,
  AiOutlineHeart,
} from "react-icons/ai";
import { BiBook, BiBookmark } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { FaBookOpen, FaStar } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdAccessTime, MdExplore, MdLoop, MdMenuBook } from "react-icons/md";

export interface NavItem {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const sidebarSections: NavSection[] = [
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

export const bottomNavPrimary: NavItem[] = [
  { to: "/surah", icon: FaBookOpen, label: "Surah" },
  { to: "/para", icon: MdMenuBook, label: "Para" },
  { to: "/prayer-times", icon: MdAccessTime, label: "Prayer" },
  { to: "/tasbih", icon: MdLoop, label: "Tasbih" },
];

export const bottomNavOverflow: NavItem[] = [
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

export function isActiveMatch(pathname: string, to: string): boolean {
  if (pathname === to) return true;
  if (to === "/surah" && pathname.startsWith("/surah")) return true;
  if (to === "/para" && pathname.startsWith("/para")) return true;
  return false;
}
