// small label for tech stacks/skills
import type { ReactNode } from "react";

const variants = {
  pill: "rounded-full bg-secondary px-3 py-1 text-secondary-foreground",
  outline: "rounded-md border border-border bg-muted px-2.5 py-1 text-foreground",
};

export default function Badge({
  variant = "pill",
  children,
}: {
  variant?: keyof typeof variants;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium sm:text-sm ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function BadgeList({
  items,
  variant,
  className = "",
}: {
  items: string[];
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Badge variant={variant}>{item}</Badge>
        </li>
      ))}
    </ul>
  );
}
