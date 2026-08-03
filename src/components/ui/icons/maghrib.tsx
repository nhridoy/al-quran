import type { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {
  className?: string;
}

export function MaghribIcon({ className, ...props }: IconProps) {
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
      <path d="M17 18a6 6 0 10-10 0" />
      <path d="M3 18h18" />
      <path d="M12 10v4" />
      <path d="M9 14l3 3 3-3" />
    </svg>
  );
}
