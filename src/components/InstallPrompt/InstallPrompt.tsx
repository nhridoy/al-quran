import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

const DISMISSED_KEY = "installPromptDismissed";
const FALLBACK_TIMEOUT = 5_000;
const GUIDE_TIMEOUT = 10_000;

function isSafari(): boolean {
  if (globalThis.window === undefined) return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("chrome");
}

function isIOS(): boolean {
  if (globalThis.window === undefined) return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  if (globalThis.window === undefined) return false;
  return (
    globalThis.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (globalThis.window === undefined) return false;
    return localStorage.getItem(DISMISSED_KEY) === "true";
  });
  const [showFallback, setShowFallback] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const guideTimerRef = useRef<number>(undefined);
  const fallbackTimerRef = useRef<number>(undefined);

  useEffect(() => {
    if (dismissed || isStandalone()) return;

    const handler = (e: BeforeInstallPromptEvent) => {
      // e.preventDefault();
      e.prompt();
      setDeferredPrompt(e);
      setShowFallback(false);
      clearTimeout(fallbackTimerRef.current);
    };

    globalThis.addEventListener("beforeinstallprompt", handler);
    return () => globalThis.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone()) {
        setShowFallback(true);
      }
    }, FALLBACK_TIMEOUT);
    fallbackTimerRef.current = timer;
    return () => clearTimeout(timer);
  }, [dismissed, deferredPrompt]);

  useEffect(() => {
    const handleAppInstalled = () => {
      setDismissed(true);
      setShowFallback(false);
      setShowGuide(false);
    };
    globalThis.addEventListener("appinstalled", handleAppInstalled);
    return () =>
      globalThis.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setShowFallback(false);
    setShowGuide(false);
    if (globalThis.window !== undefined) {
      localStorage.setItem(DISMISSED_KEY, "true");
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setDeferredPrompt(null);
        setShowFallback(false);
      } else {
        handleDismiss();
      }
      return;
    }
    setShowGuide(true);
    clearTimeout(guideTimerRef.current);
    guideTimerRef.current = setTimeout(
      () => setShowGuide(false),
      GUIDE_TIMEOUT,
    );
  }, [deferredPrompt, handleDismiss]);

  if (!(deferredPrompt || showFallback) || dismissed) return null;

  const isIOSorSafari = isIOS() || isSafari();

  return (
    <div className="fixed bottom-24 left-4 z-50 md:bottom-6 md:left-6">
      {showGuide && (
        <div className="absolute bottom-full left-0 mb-3 w-64 animate-[fadeIn_0.2s_ease-out]">
          <div className="rounded-xl bg-surface-card p-3 shadow-xl ring-1 ring-border dark:bg-dark-surface-card dark:ring-dark-border">
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
              {isIOSorSafari ? (
                <>
                  Tap the{" "}
                  <span className="inline-block rounded bg-surface-alt px-1 font-semibold text-text-primary dark:bg-dark-surface-alt dark:text-dark-text-primary">
                    Share
                  </span>{" "}
                  button <span className="text-base">⎙</span> in Safari, then
                  scroll down and tap{" "}
                  <span className="font-semibold text-primary dark:text-secondary-light">
                    Add to Home Screen
                  </span>
                  .
                </>
              ) : (
                <>
                  Use your browser's menu to find the{" "}
                  <span className="font-semibold text-primary dark:text-secondary-light">
                    Install
                  </span>{" "}
                  or{" "}
                  <span className="font-semibold text-primary dark:text-secondary-light">
                    Add to Home Screen
                  </span>{" "}
                  option, or check your address bar for an install icon.
                </>
              )}
            </p>
          </div>
          <div className="ml-3 h-2 w-2 -rotate-45 rounded-br-sm bg-surface-card ring-1 ring-border dark:bg-dark-surface-card dark:ring-dark-border" />
        </div>
      )}
      <div className="group flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 shadow-lg backdrop-blur-xl ring-1 ring-border dark:bg-dark-surface/90 dark:ring-dark-border transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95">
        <button
          type="button"
          onClick={handleInstall}
          className="flex items-center gap-2"
        >
          <MdOutlineFileDownload className="size-5 text-primary dark:text-secondary-light" />
          <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary whitespace-nowrap">
            Install App
          </span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-1 rounded-full p-0.5 text-text-muted transition-colors hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
          aria-label="Dismiss install prompt"
        >
          <IoMdClose className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
