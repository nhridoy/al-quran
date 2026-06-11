import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";
import { PRAYER_REFRESH_INTERVAL } from "@/lib/const";
import { formatDateLong } from "@/lib/date";
import {
  buildPrayerEntries,
  buildPrayerWindowMap,
  computePrayerTimes,
  findCurrentPrayer,
  findNextPrayer,
  formatTime,
  getCountdown,
  getTahajjudTime,
} from "@/lib/prayerTimes";
import LocationGate from "@/components/common/LocationGate/LocationGate";
import { useLocationStore } from "@/store/location";
import { useSettings } from "@/store/settings";

export default function PrayerTimesPage() {
  const prayerCalcMethod = useSettings((s) => s.prayerCalcMethod);
  const prayerAsrMethod = useSettings((s) => s.prayerAsrMethod);
  const { lat, lng } = useLocationStore();
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

  const extendedPrayers = useMemo(() => {
    if (!times) return [];
    const byKey = (key: string) => prayers.find((p) => p.key === key);
    const fajr = byKey("fajr");
    const sunrise = byKey("sunrise");
    const dhuhr = byKey("dhuhr");
    const asr = byKey("asr");
    const maghrib = byKey("maghrib");
    const isha = byKey("isha");
    if (!fajr || !sunrise || !dhuhr || !asr || !maghrib || !isha) return [];

    const duhaTime = new Date(sunrise.time.getTime() + 15 * 60000);
    const zawalStart = new Date(dhuhr.time.getTime() - 7 * 60000);
    const tahajjudTime = getTahajjudTime(times);

    return [
      { ...fajr, endTime: prayerWindowMap?.get("fajr") ?? null },
      { ...sunrise, endTime: null },
      {
        key: "forbidden-sunrise",
        name: "prayerTimes.forbiddenTime",
        time: sunrise.time,
        icon: "\u26a0\ufe0f",
        endTime: duhaTime,
      },
      {
        key: "duha",
        name: "prayerTimes.duha",
        time: duhaTime,
        icon: "\u2600\ufe0f",
        endTime: null,
      },
      {
        key: "forbidden-zawal",
        name: "prayerTimes.forbiddenTime",
        time: zawalStart,
        icon: "\u26a0\ufe0f",
        endTime: dhuhr.time,
      },
      { ...dhuhr, endTime: prayerWindowMap?.get("dhuhr") ?? null },
      { ...asr, endTime: prayerWindowMap?.get("asr") ?? null },
      {
        key: "forbidden-asr",
        name: "prayerTimes.forbiddenTime",
        time: asr.time,
        icon: "\u26a0\ufe0f",
        endTime: maghrib.time,
      },
      {
        key: "sunset",
        name: "prayerTimes.sunset",
        time: times.sunset,
        icon: "\ud83c\udf07",
        endTime: null,
      },
      { ...maghrib, endTime: prayerWindowMap?.get("maghrib") ?? null },
      { ...isha, endTime: prayerWindowMap?.get("isha") ?? null },
      {
        key: "tahajjud",
        name: "prayerTimes.tahajjud",
        time: tahajjudTime,
        icon: "\ud83c\udf19",
        endTime: null,
      },
    ];
  }, [times, prayers, prayerWindowMap]);

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
      description={formatDateLong(now, locale as "en" | "bn")}
    >
      <LocationGate>
        {nextPrayer && (
        <div className="overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary-light to-secondary p-6 text-white shadow-xl shadow-primary/20">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            {t("prayerTimes.nextPrayer")}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{t(nextPrayer.name)}</span>
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
            {coords != null ? `${coords.lat.toFixed(4)}°N` : "—"}, {coords != null ? `${coords.lng.toFixed(4)}°E` : "—"}
          </p>
        </div>
      )}

      {extendedPrayers.length > 0 && (
        <div className="space-y-2">
          {extendedPrayers.map((p) => {
            const isCurrent = currentPrayer?.key === p.key;
            const isNext = nextPrayer?.key === p.key;
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
                    {t(p.name)}
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
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">
                    {formatTime(p.time)}
                  </span>
                  {p.endTime && (
                    <span className="block text-xs tabular-nums text-text-muted dark:text-dark-text-muted">
                      — {formatTime(p.endTime)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </LocationGate>
    </PageShell>
  );
}
