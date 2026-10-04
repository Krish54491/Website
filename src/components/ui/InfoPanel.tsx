// bordered panel with a small uppercase title, plus helpers for label/value rows and link lists
import type { ReactNode } from "react";

export default function InfoPanel({
  title,
  className = "",
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6 ${className}`}
    >
      {title && (
        <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export function MetaList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-border">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
        >
          <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {item.label}
          </dt>
          <dd className="text-right font-semibold">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LinkList({
  links,
}: {
  links: { name: string; link: string }[];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.link}>
          <a
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 font-semibold transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 shrink-0 text-primary"
            >
              <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
