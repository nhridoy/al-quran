import { useState } from "react";
import { BiCheckCircle, BiDownload, BiExport } from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import {
  getAllFromStore,
  getFromStore,
  getKeys,
  STORE_NAMES,
} from "@/lib/cache";

export default function DataExport() {
  const { t } = useLocale();
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const [storeCount, setStoreCount] = useState(0);

  const handleExport = async () => {
    setExporting(true);
    setDone(false);
    try {
      const data: Record<string, unknown> = {};
      let count = 0;

      for (const name of STORE_NAMES) {
        const keys = await getKeys(name);
        if (keys.length === 0) continue;

        if (keys.length === 1 && keys[0] === "all") {
          const all = await getAllFromStore<unknown>(name);
          data[name] = all;
        } else {
          const store: Record<string, unknown> = {};
          for (const key of keys) {
            store[key] = await getFromStore<unknown>(name, key);
          }
          data[name] = store;
        }
        count++;
      }

      setStoreCount(count);

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quran-app-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageShell head={t("export.pageTitle")}>
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
          <div className="mb-1 flex items-center gap-2">
            <BiExport className="text-xl" />
            <span className="text-sm font-semibold">
              {t("export.headerTitle")}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/80">
            {t("export.headerSubtitle")}
          </p>
        </div>

        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            {t("export.exportDescription")}
          </p>
        </div>

        {done && (
          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-800/30 dark:bg-green-900/10">
            <BiCheckCircle className="text-xl text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {t("export.exportSuccess")}
              </p>
              <p className="text-xs text-green-600/70 dark:text-green-400/70">
                {t("export.storesCount", { count: storeCount })}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="gradient"
          className="w-full gap-2"
          onClick={handleExport}
          disabled={exporting}
        >
          <BiDownload className="text-lg" />
          {exporting ? t("common.loading") : t("export.exportButton")}
        </Button>
      </div>
    </PageShell>
  );
}
