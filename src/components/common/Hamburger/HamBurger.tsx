import { Spin as HamburgerBtn } from "hamburger-react";
import { useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineHeart } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";
import { RiHandHeartLine } from "react-icons/ri";
import { VscBook } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navLinks = [
  { to: "/surah", icon: VscBook, label: "Surah" },
  { to: "/para", icon: MdMenuBook, label: "Para" },
  { to: "/settings", icon: IoSettingsOutline, label: "Settings" },
  { to: "/about", icon: BsInfoCircle, label: "About" },
  { to: "/credits", icon: AiOutlineHeart, label: "Credits" },
  { to: "/donation", icon: RiHandHeartLine, label: "Donation" },
];

export default function HamBurger() {
  const [sidebarLeft, setSidebarLeft] = useState(false);

  const close = () => setSidebarLeft(false);

  return (
    <Sheet open={sidebarLeft} onOpenChange={setSidebarLeft}>
      <Button
        variant="ghost"
        className="dark:text-white bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
        onClick={() => setSidebarLeft(true)}
        aria-label="Open menu"
      >
        <HamburgerBtn
          size={20}
          toggled={sidebarLeft}
          hideOutline={false}
          rounded
        />
      </Button>

      <SheetContent side="left" className="flex flex-col p-0 w-2/3 md:w-80">
        <div className="flex items-center justify-center p-5 text-white bg-primary">
          <h1 className="text-2xl font-bold">Al Quran</h1>
        </div>

        <nav className="flex-1 flex flex-col">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 transition-colors ${
                    isActive
                      ? "bg-surface-alt dark:bg-dark-surface-alt text-primary dark:text-secondary-light"
                      : "hover:bg-surface-alt dark:hover:bg-dark-surface-alt text-text-primary dark:text-dark-text-primary"
                  }`
                }
              >
                <Icon className="text-xl" />
                <span className="font-bold">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <Button
          variant="default"
          onClick={close}
          className="flex w-full items-center justify-center gap-1 py-3 h-auto rounded-none"
        >
          <AiOutlineDoubleLeft />
          Close
        </Button>
      </SheetContent>
    </Sheet>
  );
}
