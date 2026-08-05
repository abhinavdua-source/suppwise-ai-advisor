import type { ReactNode } from "react";

export function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}): ReactNode {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined leading-none select-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
