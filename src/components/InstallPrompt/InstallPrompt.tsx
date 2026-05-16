import { useCallback, useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<Event | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as any).prompt();
    const result = await (deferredPrompt as any).userChoice;
    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
    } else {
      setDismissed(true);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 md:bottom-6 md:left-6">
      <div className="group flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 shadow-lg backdrop-blur-xl ring-1 ring-border dark:bg-dark-surface/90 dark:ring-dark-border transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95">
        <button
          type="button"
          onClick={handleInstall}
          className="flex items-center gap-2"
        >
          <svg
            className="h-5 w-5 text-primary dark:text-secondary-light"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
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
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
