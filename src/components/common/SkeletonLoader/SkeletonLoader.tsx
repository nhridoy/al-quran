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
  const keys = Array.from({ length: count }, () => crypto.randomUUID());
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
