// slide out menu for small screens(from brittanychiang.com v4)
// hamburger turns into an X, a sidebar slides in from the right and the page behind gets blurred
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import ResumeButton from "./ResumeButton";
import { isNavLinkActive, type NavLinkItem } from "./types";
import type { Section } from "../utils/section";

export default function MobileNav({
  links,
  resume,
  pathname,
  section,
}: {
  links: NavLinkItem[];
  resume?: { label: string; href: string };
  pathname: string;
  section: Section;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // close whenever the page changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    // html is the scroll container in index.css so lock scrolling there
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    menuRef.current?.querySelector("a")?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  // keep tab focus inside the button + menu while it's open
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open || event.key !== "Tab") return;
    const focusables = [
      buttonRef.current,
      ...(menuRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
    ].filter((el): el is HTMLElement => el !== null);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const lineClasses =
    "absolute top-1/2 right-0 -mt-px h-0.5 rounded-full bg-foreground transition-[translate,rotate,opacity,width] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none";

  return (
    <div className="md:hidden" onKeyDown={trapFocus}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((prev) => !prev)}
        className="relative z-60 -mr-2 block size-11 rounded-md p-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="relative block h-full w-full">
          <span
            className={`${lineClasses} w-full ${open ? "rotate-45" : "-translate-y-2"}`}
          />
          <span
            className={`${lineClasses} ${open ? "w-0 opacity-0" : "w-4/5 opacity-100"}`}
          />
          <span
            className={`${lineClasses} w-full ${open ? "-rotate-45" : "translate-y-2"}`}
          />
        </span>
      </button>

      {/* blurred backdrop over the page, tapping it closes the menu */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-background/40 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(75vw,400px)] items-center justify-center bg-card text-card-foreground shadow-[-10px_0_30px_-15px_rgb(0_0_0/0.5)] transition-[translate,visibility] duration-250 ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none ${open ? "visible translate-x-0" : "invisible translate-x-full"}`}
      >
        <nav aria-label="Mobile" className="flex w-full flex-col items-center">
          <ol className="w-full">
            {links.map((link, idx) => {
              const active = isNavLinkActive(link, pathname, section);
              return (
                <li key={link.to} className="text-center">
                  <Link
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`group inline-block px-5 pt-1 pb-5 text-lg transition-colors duration-200 sm:text-xl ${active ? link.activeClassName : link.hoverClassName}`}
                  >
                    <span
                      className={`mb-1 block text-sm transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none ${link.numberClassName}`}
                    >
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    <span
                      className={`border-b-2 pb-0.5 ${active ? "" : "border-transparent"}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          {resume && (
            <div className="mt-[10%]">
              <ResumeButton href={resume.href} label={resume.label} size="lg" />
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
}
