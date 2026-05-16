import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";

// 1. Properly extend the global WindowEventMap to include the custom PWA events
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
}

const DISMISSED_KEY = "installPromptDismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DISMISSED_KEY) === "true";
  });

  useEffect(() => {
    // 2. Safely check for matchMedia in SSR environments
    if (
      dismissed ||
      (typeof window !== "undefined" &&
        window.matchMedia("(display-mode: standalone)").matches)
    )
      return;

    // 3. Explicitly type the event parameter
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  useEffect(() => {
    const handleAppInstalled = () => {
      setDismissed(true);
    };
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISSED_KEY, "true");
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
    } else {
      handleDismiss();
    }
  }, [deferredPrompt, handleDismiss]);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 md:bottom-6 md:left-6">
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
