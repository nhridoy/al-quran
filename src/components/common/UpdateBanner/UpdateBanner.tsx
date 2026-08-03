import { useRegisterSW } from "virtual:pwa-register/react";
import { MdClose, MdRefresh } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";

export default function UpdateBanner() {
  const { t } = useLocale();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-36 left-4 z-50 md:bottom-14 md:left-6 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 shadow-lg backdrop-blur-xl ring-1 ring-border dark:bg-dark-surface/90 dark:ring-dark-border transition-all duration-300">
        <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary whitespace-nowrap">
          {t("update.newVersion")}
        </span>
        <Button
          variant="default"
          className="flex items-center gap-1 rounded-full px-3 py-1 text-xs h-auto"
          onClick={() => updateServiceWorker(true)}
        >
          <MdRefresh className="size-3.5" />
          {t("update.refresh")}
        </Button>
        <Button
          variant="secondary-ghost"
          size="icon-xs"
          className="rounded-full"
          onClick={() => setNeedRefresh(false)}
          aria-label={t("update.dismiss")}
        >
          <MdClose className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
