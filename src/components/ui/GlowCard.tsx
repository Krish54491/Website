// card shell with a drop shadow in the section's primary color that grows on hover
// renders as a router Link when given `to`, otherwise a plain div
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const glowCardClasses =
  "group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg shadow-primary/15 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/45 focus-visible:-translate-y-1 focus-visible:shadow-2xl focus-visible:shadow-primary/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function GlowCard({
  to,
  className = "",
  children,
}: {
  to?: string;
  className?: string;
  children: ReactNode;
}) {
  if (to) {
    return (
      <Link to={to} className={`${glowCardClasses} ${className}`}>
        {children}
      </Link>
    );
  }
  return <div className={`${glowCardClasses} ${className}`}>{children}</div>;
}
