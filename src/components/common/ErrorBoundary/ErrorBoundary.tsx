import { Component } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { type AppLocale, LocaleContext } from "@/i18n";
import en from "@/i18n/en.json";

function resolveVal(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static contextType = LocaleContext;
  declare context: { locale: AppLocale; t: (key: string) => string } | null;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const ctx = this.context;
      const t =
        ctx?.t ??
        ((key: string) => resolveVal(en as Record<string, unknown>, key));

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <BiErrorCircle className="text-5xl text-error" />
          <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
            {t("error.title")}
          </h2>
          <p className="max-w-md text-sm text-text-muted dark:text-dark-text-muted">
            {this.state.error?.message ?? t("error.unexpected")}
          </p>
          <button
            onClick={this.handleRetry}
            type="button"
            className="cursor-pointer rounded-xl bg-linear-to-br from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
          >
            {t("error.tryAgain")}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
