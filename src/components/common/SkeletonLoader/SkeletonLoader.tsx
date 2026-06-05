import { useId, useMemo } from "react";

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

export function SkeletonLoader({
  count = 5,
  height = "h-24",
  className,
}: SkeletonLoaderProps) {
  const baseId = useId();
  const keys = useMemo(
    () => Array.from({ length: count }, (_, i) => `${baseId}-skel-${i}`),
    [baseId, count],
  );
  return (
    <div className={`space-y-3${className ? ` ${className}` : ""}`}>
      {keys.map((key) => (
        <div
          key={key}
          className={`${height} animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt`}
        />
      ))}
    </div>
  );
}
