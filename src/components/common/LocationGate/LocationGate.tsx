import type { ReactNode } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import { useLocationStore } from "@/store/location";

export default function LocationGate({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = useLocale();
  const lat = useLocationStore((s) => s.lat);
  const lng = useLocationStore((s) => s.lng);
  const loading = useLocationStore((s) => s.loading);
  const error = useLocationStore((s) => s.error);
  const request = useLocationStore((s) => s.request);

  if (lat != null && lng != null) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface py-12 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary dark:border-dark-border dark:border-t-secondary" />
        <p className="text-sm text-text-muted dark:text-dark-text-muted">
          {t("common.detectingLocation")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface py-12 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <IoLocationOutline className="text-3xl text-red-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-text dark:text-dark-text">
            {t("common.locationError")}
          </p>
          <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
            {error}
          </p>
        </div>
        <Button onClick={request} variant="gradient" className="rounded-xl px-5 py-2 text-sm font-semibold">
          {t("common.tryAgain")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface py-12 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
      <IoLocationOutline className="text-3xl text-text-muted dark:text-dark-text-muted" />
      <div className="text-center">
        <p className="text-sm font-medium text-text dark:text-dark-text">
          {t("common.enableLocation")}
        </p>
        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
          {t("common.enableLocationDesc")}
        </p>
      </div>
      <Button
        onClick={request}
        variant="gradient"
        className="rounded-xl px-5 py-2 text-sm font-semibold"
      >
        {t("common.shareLocation")}
      </Button>
    </div>
  );
}
