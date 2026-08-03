import type { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {
  className?: string;
}

export function FajrIcon({ className, ...props }: IconProps) {
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
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      <circle cx="17" cy="16" r="1.2" />
      <path d="M3 16h4" />
      <path d="M11 16h2" />
    </svg>
  );
}
