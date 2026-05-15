import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  direction?: "left" | "bottom" | "center";
}

const ANIM_MS = 250;

const enterAnim: Record<string, string> = {
  left: "animate-slide-left",
  bottom: "animate-slide-up",
  center: "animate-scale-in",
};

const exitAnim: Record<string, string> = {
  left: "animate-slide-left-out",
  bottom: "animate-slide-up-out",
  center: "animate-scale-out",
};

const positionMap: Record<string, string> = {
  left: "left-0 top-0 h-full overflow-y-auto",
  bottom: "bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

type Phase = "hidden" | "entering" | "visible" | "exiting";

export default function Drawer({
  open,
  onClose,
  children,
  className = "",
  direction = "bottom",
}: DrawerProps) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const prevOpen = useRef(open);

  useLayoutEffect(() => {
    if (open && !prevOpen.current) {
      setPhase("entering");
    } else if (!open && prevOpen.current) {
      setPhase("exiting");
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (phase === "entering") {
      const t = setTimeout(() => setPhase("visible"), ANIM_MS);
      return () => clearTimeout(t);
    }
    if (phase === "exiting") {
      const t = setTimeout(() => setPhase("hidden"), ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (phase !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "hidden") return null;

  const isExiting = phase === "exiting";
  const overlayAnim = isExiting ? "animate-fade-out" : "animate-fade-in";
  const contentAnim = isExiting ? exitAnim[direction] : enterAnim[direction];

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default ${overlayAnim}`}
        onClick={onClose}
        tabIndex={-1}
        aria-label="Close"
      />
      <div
        className={`absolute ${contentAnim} ${positionMap[direction]} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
