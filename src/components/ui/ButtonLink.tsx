// link styled as a button, uses a router Link for internal paths and an <a> for everything else
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 border border-primary",
  outline:
    "border border-primary text-foreground bg-transparent hover:bg-primary hover:text-primary-foreground",
};

export default function ButtonLink({
  to,
  href,
  variant = "primary",
  external = false,
  children,
}: {
  to?: string;
  href?: string;
  variant?: keyof typeof variants;
  external?: boolean; // opens in a new tab
  children: ReactNode;
}) {
  const className = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${variants[variant]}`;
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
