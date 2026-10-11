// fancy link buttons, uses a router Link for internal paths and an <a> for everything else
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonLinkProps = {
  to?: string; // internal route Ex. "/projects"
  href?: string; // anything else Ex. a pdf, mailto:, another site
  external?: boolean; // opens in a new tab
  children: ReactNode;
};

export function WhirlpoolConicButton({
  to,
  href,
  external = false,
  children,
}: ButtonLinkProps) {
  const classes =
    "group relative inline-flex overflow-hidden rounded-xl p-0.5 text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors duration-100 hover:text-accent-foreground";

  const inner = (
    <>
      <span className="absolute -inset-full animate-spin bg-[conic-gradient(from_0deg,#ff7a00,#f43f5e,#8b5cf6,#06b6d4,#ff7a00)] motion-reduce:animate-none" />
      <span className="relative rounded-[10px] bg-primary px-8 py-3 transition duration-200 hover:bg-accent">
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
export function CenterPillFillButton({
  to,
  href,
  external = false,
  children,
}: ButtonLinkProps) {
  const classes =
    "relative px-10 py-3 border-2 border-primary text-primary font-bold rounded-full overflow-hidden group bg-accent";
  const inner = (
    <>
      <span className="relative z-10 group-hover:text-secondary transition-colors">
        {children}
      </span>
      <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-105 transition-transform origin-center motion-reduce:transition-none"></div>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
