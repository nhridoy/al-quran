import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import bn from "./bn.json";
import en from "./en.json";

export type AppLocale = "en" | "bn";

const LOCALE_MAP: Record<AppLocale, Record<string, unknown>> = { en, bn };

function resolveValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return path;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") return current;
  return path;
}

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key];
    return val !== undefined ? String(val) : `{${key}}`;
  });
}

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: AppLocale;
}) {
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "bn";
  }, [locale]);

  const setLocale = useCallback((l: AppLocale) => {
    setLocaleState(l);
  }, []);

  const t: LocaleContextValue["t"] = useCallback(
    (key, params) => {
      const bundle = LOCALE_MAP[locale] || en;
      const raw = resolveValue(bundle as Record<string, unknown>, key);
      return interpolate(raw, params);
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: (key, params) => {
        const raw = resolveValue(en as Record<string, unknown>, key);
        return interpolate(raw, params);
      },
    };
  }
  return ctx;
}
