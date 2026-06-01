import type { ReactNode } from "react";
import { Header } from "@/components/common/Header/Header";

interface PageShellProps {
  head: string;
  showBack?: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  head,
  showBack,
  title,
  description,
  children,
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen">
      <Header head={head} showBack={showBack} />
      <div
        className={`mx-4 space-y-4 pb-8 md:mx-6${className ? ` ${className}` : ""}`}
      >
        {(title || description) && (
          <div className="mb-2">
            {title && (
              <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-text-muted dark:text-dark-text-muted">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
