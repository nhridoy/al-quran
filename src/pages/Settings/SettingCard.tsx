export default function SettingCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface">
      <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            {title}
          </h3>
          <p className="text-xs text-text-muted dark:text-dark-text-muted">
            {description}
          </p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
