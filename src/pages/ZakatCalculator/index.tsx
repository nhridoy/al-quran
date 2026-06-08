import { useCallback, useMemo, useState } from "react";
import {
  BiChevronDown,
  BiChevronUp,
  BiCoin,
  BiInfoCircle,
} from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";

type NisabMethod = "gold" | "silver";
type Step = "assets" | "rates" | "result";

interface AssetInput {
  label: string;
  key: string;
  icon: string;
  description?: string;
  tKey: string;
}

const ASSETS: AssetInput[] = [
  { label: "Cash & Bank", key: "cash", icon: "💰", tKey: "zakat.assetCash" },
  {
    label: "Gold (grams)",
    key: "goldGrams",
    icon: "🥇",
    description: "Total gold weight in grams",
    tKey: "zakat.assetGold",
  },
  {
    label: "Silver (grams)",
    key: "silverGrams",
    icon: "🥈",
    description: "Total silver weight in grams",
    tKey: "zakat.assetSilver",
  },
  {
    label: "Investments",
    key: "investments",
    icon: "📈",
    description: "Stocks, bonds, funds",
    tKey: "zakat.assetInvestments",
  },
  {
    label: "Business Inventory",
    key: "business",
    icon: "🏪",
    description: "Value of saleable goods",
    tKey: "zakat.assetBusiness",
  },
  {
    label: "Rental Property",
    key: "property",
    icon: "🏠",
    description: "Only investment/rental properties",
    tKey: "zakat.assetProperty",
  },
  {
    label: "Money Owed to You",
    key: "receivables",
    icon: "📄",
    tKey: "zakat.assetReceivables",
  },
  {
    label: "Debts You Owe",
    key: "payables",
    icon: "📋",
    description: "Subtracted from total",
    tKey: "zakat.assetPayables",
  },
];

const KARAT_OPTIONS = [
  { value: 24, label: "24K (99.9%)", tKey: "zakat.karat24" },
  { value: 22, label: "22K (91.7%)", tKey: "zakat.karat22" },
  { value: 21, label: "21K (87.5%)", tKey: "zakat.karat21" },
  { value: 18, label: "18K (75%)", tKey: "zakat.karat18" },
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function loadRates(): { gold: number; silver: number } {
  try {
    const saved = localStorage.getItem("zakat-rates");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { gold: 0, silver: 0 };
}

function saveRates(gold: number, silver: number) {
  localStorage.setItem("zakat-rates", JSON.stringify({ gold, silver }));
}

export default function ZakatCalculator() {
  const [step, setStep] = useState<Step>("assets");
  const [values, setValues] = useState<Record<string, string>>({});
  const [goldKarat, setGoldKarat] = useState(24);
  const [nisabMethod, setNisabMethod] = useState<NisabMethod>("silver");
  const [rates, setRates] = useState(loadRates);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { t } = useLocale();

  const updateValue = useCallback((key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const parsed = useMemo(() => {
    const raw: Record<string, number> = {};
    for (const asset of ASSETS) {
      raw[asset.key] = Number.parseFloat(values[asset.key] || "0") || 0;
    }
    return raw;
  }, [values]);

  const goldPureGrams = useMemo(() => {
    return parsed.goldGrams * (goldKarat / 24);
  }, [parsed.goldGrams, goldKarat]);

  const goldValue = useMemo(() => {
    return goldPureGrams * rates.gold;
  }, [goldPureGrams, rates.gold]);

  const silverValue = useMemo(() => {
    return parsed.silverGrams * rates.silver;
  }, [parsed.silverGrams, rates.silver]);

  const totalAssets = useMemo(() => {
    return (
      parsed.cash +
      goldValue +
      silverValue +
      parsed.investments +
      parsed.business +
      parsed.property +
      parsed.receivables
    );
  }, [parsed, goldValue, silverValue]);

  const netAssets = useMemo(() => {
    return totalAssets - parsed.payables;
  }, [totalAssets, parsed.payables]);

  const nisabThreshold = useMemo(() => {
    if (nisabMethod === "gold") return 85 * rates.gold;
    return 595 * rates.silver;
  }, [nisabMethod, rates]);

  const aboveNisab = useMemo(() => {
    return netAssets >= nisabThreshold;
  }, [netAssets, nisabThreshold]);

  const zakatDue = useMemo(() => {
    return aboveNisab ? netAssets * 0.025 : 0;
  }, [aboveNisab, netAssets]);

  const canProceed = useMemo(() => {
    if (step === "assets") {
      return Object.values(values).some((v) => Number.parseFloat(v || "0") > 0);
    }
    if (step === "rates") return rates.gold > 0 && rates.silver > 0;
    return true;
  }, [step, values, rates]);

  const handleNext = useCallback(() => {
    if (step === "assets") setStep("rates");
    else if (step === "rates") {
      saveRates(rates.gold, rates.silver);
      setStep("result");
    }
  }, [step, rates]);

  const handleBack = useCallback(() => {
    if (step === "rates") setStep("assets");
    else if (step === "result") setStep("rates");
  }, [step]);

  return (
    <PageShell head={t("zakat.pageTitle")} showBack>
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
        <div className="mb-1 flex items-center gap-2">
          <BiCoin className="text-xl" />
          <span className="text-sm font-medium">{t("zakat.headerTitle")}</span>
        </div>
        <p className="mt-2 text-sm text-white/80">
          {t("zakat.headerSubtitle")}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 rounded-2xl bg-surface px-5 py-3 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        {(["assets", "rates", "result"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step === s
                  ? "bg-primary text-white"
                  : i < ["assets", "rates", "result"].indexOf(step)
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-alt text-text-muted dark:bg-dark-surface-alt dark:text-dark-text-muted"
              }`}
            >
              {i < ["assets", "rates", "result"].indexOf(step) ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-medium capitalize ${
                step === s
                  ? "text-text dark:text-dark-text"
                  : "text-text-muted dark:text-dark-text-muted"
              }`}
            >
              {
                {
                  assets: t("zakat.stepAssets"),
                  rates: t("zakat.stepRates"),
                  result: t("zakat.stepResult"),
                }[s]
              }
            </span>
            {i < 2 && (
              <div className="mx-1 h-px w-6 bg-border dark:bg-dark-border" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Assets */}
      {step === "assets" && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <h2 className="mb-4 text-sm font-semibold text-text dark:text-dark-text">
            {t("zakat.assetsHeading")}
          </h2>
          <div className="space-y-3">
            {ASSETS.map((asset) => (
              <div key={asset.key}>
                <div className="mb-1 flex items-center gap-2 text-xs text-text-muted dark:text-dark-text-muted">
                  <span>{asset.icon}</span>
                  <span>{t(asset.tKey)}</span>
                  {asset.description && (
                    <span
                      className="flex items-center gap-0.5 text-[10px]"
                      title={t(`zakat.${asset.key}Desc`)}
                    >
                      <BiInfoCircle /> {t("common.info")}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={values[asset.key] ?? ""}
                    onChange={(e) => updateValue(asset.key, e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-8 pr-3 text-sm text-text outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
                  />
                </div>
                {asset.key === "goldGrams" && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">
                      {t("zakat.karatLabel")}
                    </span>
                    <select
                      value={goldKarat}
                      onChange={(e) => setGoldKarat(Number(e.target.value))}
                      className="rounded-lg border border-border bg-surface-alt px-2 py-1 text-xs text-text outline-none dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
                    >
                      {KARAT_OPTIONS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {t(k.tKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Rates */}
      {step === "rates" && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <h2 className="mb-4 text-sm font-semibold text-text dark:text-dark-text">
            {t("zakat.ratesHeading")}
          </h2>
          <p className="mb-4 text-xs text-text-muted dark:text-dark-text-muted">
            {t("zakat.ratesDescription")}
          </p>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="gold-rate"
                className="mb-1 block text-xs text-text-muted dark:text-dark-text-muted"
              >
                {t("zakat.rateGold")}
              </label>
              <input
                id="gold-rate"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("zakat.goldPlaceholder")}
                value={rates.gold || ""}
                onChange={(e) =>
                  setRates((r) => ({
                    ...r,
                    gold: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-border bg-surface-alt py-2.5 px-3 text-sm text-text outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
              />
            </div>
            <div>
              <label
                htmlFor="silver-rate"
                className="mb-1 block text-xs text-text-muted dark:text-dark-text-muted"
              >
                {t("zakat.rateSilver")}
              </label>
              <input
                id="silver-rate"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("zakat.silverPlaceholder")}
                value={rates.silver || ""}
                onChange={(e) =>
                  setRates((r) => ({
                    ...r,
                    silver: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-border bg-surface-alt py-2.5 px-3 text-sm text-text outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
              />
            </div>
            <div>
              <label
                htmlFor="silver-rate"
                className="mb-1 block text-xs text-text-muted dark:text-dark-text-muted"
              >
                {t("zakat.rateSilver")}
              </label>
              <input
                id="silver-rate"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("zakat.silverPlaceholder")}
                value={rates.silver || ""}
                onChange={(e) =>
                  setRates((r) => ({
                    ...r,
                    silver: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-border bg-surface-alt py-2.5 px-3 text-sm text-text outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
              />
            </div>
          </div>

          {/* Nisab method */}
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-semibold text-text dark:text-dark-text">
              {t("zakat.nisabHeading")}
            </h3>
            <div className="flex gap-2">
              {(["gold", "silver"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setNisabMethod(m)}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-center text-xs font-medium transition-all ${
                    nisabMethod === m
                      ? "border-primary bg-primary text-white"
                      : "border-dashed border-border bg-transparent text-text-muted hover:border-primary hover:text-primary dark:border-dark-border dark:text-dark-text-muted"
                  }`}
                >
                  {m === "gold"
                    ? `🥇 ${t("zakat.nisabGold")}`
                    : `🥈 ${t("zakat.nisabSilver")}`}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-text-muted dark:text-dark-text-muted">
              {nisabMethod === "gold"
                ? `Nisab threshold: 85g × $${rates.gold}/g = ${formatCurrency(85 * rates.gold)}`
                : `Nisab threshold: 595g × $${rates.silver}/g = ${formatCurrency(595 * rates.silver)}`}
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === "result" && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
            <p className="text-sm text-white/80">{t("zakat.zakatDue")}</p>
            <p className="text-3xl font-bold">{formatCurrency(zakatDue)}</p>
            {!aboveNisab && (
              <p className="mt-2 text-sm text-white/70">
                {t("zakat.belowNisab", {
                  netAssets: formatCurrency(netAssets),
                  threshold: formatCurrency(nisabThreshold),
                })}
              </p>
            )}
          </div>

          {/* Breakdown toggle */}
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex w-full items-center justify-between rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border transition-colors hover:bg-surface-alt dark:bg-dark-surface dark:ring-dark-border dark:hover:bg-dark-surface-alt"
          >
            <span className="text-sm font-semibold text-text dark:text-dark-text">
              {t("zakat.breakdown")}
            </span>
            {showBreakdown ? (
              <BiChevronUp className="text-lg text-text-muted" />
            ) : (
              <BiChevronDown className="text-lg text-text-muted" />
            )}
          </button>

          {showBreakdown && (
            <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
              <div className="space-y-2 text-sm">
                <BreakdownRow
                  label={t("zakat.breakdownCash")}
                  value={parsed.cash}
                />
                {parsed.goldGrams > 0 && (
                  <BreakdownRow
                    label={t("zakat.breakdownGold", {
                      grams: goldPureGrams.toFixed(2),
                      rate: rates.gold,
                    })}
                    value={goldValue}
                  />
                )}
                {parsed.silverGrams > 0 && (
                  <BreakdownRow
                    label={t("zakat.breakdownSilver", {
                      grams: parsed.silverGrams,
                      rate: rates.silver,
                    })}
                    value={silverValue}
                  />
                )}
                <BreakdownRow
                  label={t("zakat.breakdownInvestments")}
                  value={parsed.investments}
                />
                <BreakdownRow
                  label={t("zakat.breakdownBusiness")}
                  value={parsed.business}
                />
                <BreakdownRow
                  label={t("zakat.breakdownProperty")}
                  value={parsed.property}
                />
                <BreakdownRow
                  label={t("zakat.breakdownReceivables")}
                  value={parsed.receivables}
                />
                <div className="border-t border-border pt-2 dark:border-dark-border">
                  <BreakdownRow
                    label={t("zakat.breakdownTotalAssets")}
                    value={totalAssets}
                    bold
                  />
                </div>
                <BreakdownRow
                  label={t("zakat.breakdownPayables")}
                  value={-parsed.payables}
                />
                <div className="border-t border-border pt-2 dark:border-dark-border">
                  <BreakdownRow
                    label={t("zakat.breakdownNetAssets")}
                    value={netAssets}
                    bold
                  />
                </div>
                <BreakdownRow
                  label={t("zakat.breakdownNisab", {
                    method: nisabMethod === "gold" ? "85g Gold" : "595g Silver",
                  })}
                  value={nisabThreshold}
                />
                <div className="border-t border-border pt-2 dark:border-dark-border">
                  <BreakdownRow
                    label={t("zakat.breakdownZakatDue")}
                    value={zakatDue}
                    bold
                    highlight
                  />
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-2 rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
            <BiInfoCircle className="mt-0.5 shrink-0 text-text-muted" />
            <p className="text-xs text-text-muted dark:text-dark-text-muted">
              {t("zakat.disclaimer")}
            </p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step !== "assets" && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-medium text-text transition-colors hover:bg-surface-alt dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-alt"
          >
            {t("common.back")}
          </button>
        )}
        {step !== "result" && (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {step === "assets" ? t("zakat.nextRates") : t("zakat.calculate")}
          </button>
        )}
        {step === "result" && (
          <button
            type="button"
            onClick={() => {
              setStep("assets");
              setValues({});
              setShowBreakdown(false);
            }}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {t("zakat.startOver")}
          </button>
        )}
      </div>
    </PageShell>
  );
}

function BreakdownRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? "font-semibold" : ""} ${highlight ? "text-primary" : "text-text dark:text-dark-text"}`}
    >
      <span>{label}</span>
      <span>
        {value < 0
          ? `− ${formatCurrency(Math.abs(value))}`
          : formatCurrency(value)}
      </span>
    </div>
  );
}
