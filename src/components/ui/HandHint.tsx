// small handwritten looking note with a curvy arrow, for pointing out that something can be clicked/pulled/etc
// the arrow points up and to the left by default, `arrow` flips it for things on the other side
import type { ReactNode } from "react";

export default function HandHint({
  arrow = "up-left",
  className = "",
  children,
}: {
  arrow?: "up-left" | "up-right";
  className?: string;
  children: ReactNode;
}) {
  const right = arrow === "up-right";
  return (
    <p
      className={`pointer-events-none inline-flex items-start gap-1 font-hint text-sm leading-snug text-muted-foreground select-none sm:text-base ${right ? "rotate-3 flex-row-reverse" : "-rotate-3"} ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`-mt-5 size-8 shrink-0 sm:size-10 ${right ? "-scale-x-100" : ""}`}
      >
        {/* tail curls up from the text, head at the top left */}
        <path d="M42 44C40 24 28 11 8 8" />
        <path d="M19 4 8 8l7 10" />
      </svg>
      <span className="mt-1">{children}</span>
    </p>
  );
}
