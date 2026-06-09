import type { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {
  className?: string;
}

export function AsrIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="10" r="4" />
      <path d="M8.5 5.5l-2-2" />
      <path d="M15.5 5.5l2-2" />
      <path d="M6 12.5l-2 2" />
      <path d="M18 12.5l2 2" />
      <path d="M12 16v2" />
      <path d="M12 22l4-3" />
      <path d="M12 22l-4-3" />
    </svg>
  );
}
