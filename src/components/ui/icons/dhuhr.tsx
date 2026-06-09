import type { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {
  className?: string;
}

export function DhuhrIcon({ className, ...props }: IconProps) {
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
      <path d="M12 2v2" />
      <path d="M12 16v2" />
      <path d="M6 10H4" />
      <path d="M20 10h-2" />
      <path d="M8.34 4.34l1.42 1.42" />
      <path d="M15.66 15.66l1.42 1.42" />
      <path d="M8.34 15.66l1.42-1.42" />
      <path d="M15.66 4.34l1.42 1.42" />
    </svg>
  );
}
