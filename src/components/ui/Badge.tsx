// small label for tech stacks/skills
import type { ReactNode } from "react";

const variants = {
  pill: "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground sm:text-sm",
  outline:
    "rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground sm:text-sm",
  // tiny monospace tag, like chanhdang.com's stack list (documents/image-15.png)
  chip: "rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:text-xs",
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
      className={`inline-flex items-center ${variants[variant]} hover:bg-accent dark:hover:bg-background hover:scale-110 hover:text-primary hover:shadow-md hover:shadow-accent transition duration-200 ease-[ease] motion-reduce:transition-none motion-reduce:hover:scale-100`}
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
    <ul
      className={`flex flex-wrap ${variant === "chip" ? "gap-1.5" : "gap-2"} ${className}`}
    >
      {items.map((item) => (
        <li key={item}>
          <Badge variant={variant}>{item}</Badge>
        </li>
      ))}
    </ul>
  );
}
