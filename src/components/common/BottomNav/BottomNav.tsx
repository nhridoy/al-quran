import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  bottomNavOverflow,
  bottomNavPrimary,
  isActiveMatch,
} from "@/lib/navigation";

export default function BottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/80 backdrop-blur-xl dark:border-dark-border dark:bg-dark-surface/80 md:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavPrimary.map((tab) => {
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

          <Button
            variant="secondary-ghost"
            className={`flex-col gap-0.5 rounded-xl px-3 py-2 h-auto ${
              moreOpen
                ? "text-secondary dark:text-secondary-light"
                : "text-text-muted dark:text-dark-text-muted"
            }`}
            onClick={() => setMoreOpen(true)}
          >
            <div className="flex items-center justify-center rounded-lg p-1.5">
              <HiDotsHorizontal className="text-lg" />
            </div>
            <span className="text-[10px] font-medium leading-tight">More</span>
          </Button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="pb-8">
          <div className="p-4">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border dark:bg-dark-border" />
            <h3 className="mb-3 text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              More
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {bottomNavOverflow.map((tab) => {
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
        </SheetContent>
      </Sheet>
    </>
  );
}
