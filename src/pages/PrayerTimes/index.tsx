import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import { PRAYER_REFRESH_INTERVAL } from "@/lib/const";
import {
  buildPrayerEntries,
  buildPrayerWindowMap,
  computePrayerTimes,
  findCurrentPrayer,
  findNextPrayer,
  formatTime,
  getCountdown,
} from "@/lib/prayerTimes";
import { useLocationStore } from "@/store/location";
import { useSettings } from "@/store/settings";

export default function PrayerTimesPage() {
  const prayerCalcMethod = useSettings((s) => s.prayerCalcMethod);
  const prayerAsrMethod = useSettings((s) => s.prayerAsrMethod);
  const {
    lat,
    lng,
    loading: geoLoading,
    error: geoError,
    request,
  } = useLocationStore();
  const { t, locale } = useLocale();
  const [now, setNow] = useState(new Date());
  const coords = lat !== null && lng !== null ? { lat, lng } : null;

  useEffect(() => {
    const timer = setInterval(
      () => setNow(new Date()),
      PRAYER_REFRESH_INTERVAL,
    );
    return () => clearInterval(timer);
  }, []);

  const times = useMemo(
    () => computePrayerTimes(coords, prayerCalcMethod, prayerAsrMethod, now),
    [coords, prayerCalcMethod, prayerAsrMethod, now],
  );

  const prayers = useMemo(() => buildPrayerEntries(times), [times]);

  const prayerWindowMap = useMemo(
    () => (times ? buildPrayerWindowMap(prayers, times) : null),
    [prayers, times],
  );

  const nextPrayer = useMemo(
    () => findNextPrayer(prayers, now),
    [prayers, now],
  );

  const currentPrayer = useMemo(
    () => findCurrentPrayer(prayers, now),
    [prayers, now],
  );

  return (
    <PageShell
      head={t("prayerTimes.pageTitle")}
      showBack
      title={t("prayerTimes.pageTitle")}
      description={now.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    >
      {!coords && geoLoading && (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
          <p className="text-sm text-text-muted">
            {t("prayerTimes.requestingLocation")}
          </p>
        </div>
      )}

      {geoError && (
        <div className="flex flex-col items-center gap-3 card-surface p-6 text-center">
          <p className="text-sm text-text-muted">
            {t("prayerTimes.locationError", { error: geoError })}
          </p>
          <Button
            onClick={request}
            variant="gradient"
            className="rounded-xl px-5 py-2 text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            {t("error.tryAgain")}
          </Button>
        </div>
      )}

      {coords && nextPrayer && (
        <div className="overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary-light to-secondary p-6 text-white shadow-xl shadow-primary/20">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            {t("prayerTimes.nextPrayer")}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{nextPrayer.name}</span>
            <span className="text-2xl font-semibold text-white/80">
              {formatTime(nextPrayer.time)}
            </span>
          </div>
          {nextPrayer.time > now && (
            <p className="mt-2 text-lg font-semibold text-white/90">
              {getCountdown(now, nextPrayer.time)} {t("prayerTimes.remaining")}
            </p>
          )}
          <p className="mt-1 text-xs text-white/60">
            {coords.lat.toFixed(4)}&deg;N, {coords.lng.toFixed(4)}&deg;E
          </p>
        </div>
      )}

      {prayers.length > 0 && (
        <div className="space-y-2">
          {prayers.map((p) => {
            const isCurrent = currentPrayer?.name === p.name;
            const isNext = nextPrayer?.name === p.name;
            const endTime =
              p.key !== "sunrise"
                ? (prayerWindowMap?.get(p.key) ?? null)
                : null;
            return (
              <div
                key={p.key}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                  isCurrent
                    ? "border-accent/30 bg-accent-soft/50 shadow-sm dark:border-accent/20 dark:bg-accent/5"
                    : "border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isNext
                        ? "text-secondary"
                        : "text-text-primary dark:text-dark-text-primary"
                    }`}
                  >
                    {p.name}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] font-medium text-accent">
                        {t("prayerTimes.current")}
                      </span>
                    )}
                    {isNext && !isCurrent && (
                      <span className="ml-2 text-[10px] font-medium text-secondary">
                        {t("prayerTimes.next")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">
                    {p.nameBn}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">
                    {formatTime(p.time)}
                  </span>
                  {endTime && (
                    <span className="block text-xs tabular-nums text-text-muted dark:text-dark-text-muted">
                      — {formatTime(endTime)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
