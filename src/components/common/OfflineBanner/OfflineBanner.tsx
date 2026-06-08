import { useEffect, useState } from "react";
import { BiWifiOff } from "react-icons/bi";
import { useLocale } from "@/i18n";

export default function OfflineBanner() {
  const { t } = useLocale();
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    globalThis.addEventListener("offline", handleOffline);
    globalThis.addEventListener("online", handleOnline);

    return () => {
      globalThis.removeEventListener("offline", handleOffline);
      globalThis.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 bg-warning/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
      <BiWifiOff className="text-base" />
      <span>{t("offline.message")}</span>
      <button
        type="button"
        onClick={() => setOffline(false)}
        className="ml-auto cursor-pointer rounded-md bg-white/20 px-2 py-0.5 text-xs transition-colors hover:bg-white/30"
        aria-label={t("offline.dismiss")}
        title={t("offline.dismiss")}
      >
        {t("offline.dismiss")}
      </button>
    </div>
  );
}
