import { Link, useLocation } from "react-router-dom";
import MobileNav from "./MobileNav.tsx";
import ResumeButton from "./ResumeButton.tsx";
import { isNavLinkActive } from "./types.ts";
import { getSection } from "../utils/section.ts";
import { NAV_BRAND, NAV_LINKS, NAV_RESUME } from "../config/navConfig.ts";
export default function Nav() {
  const { pathname } = useLocation();
  const section = getSection(pathname);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* background lives on its own layer: a backdrop-filter on the header itself would trap the fixed mobile menu inside it */}
      <div className="absolute inset-0 -z-10 bg-background/80 shadow-md shadow-black/5 backdrop-blur-md transition-colors duration-500 dark:shadow-black/40" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          to={NAV_BRAND.to}
          className="rounded-md font-(family-name:--section-heading) text-2xl font-semibold tracking-tight transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:text-3xl"
        >
          {NAV_BRAND.label}
          <span className="text-primary">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav>
            <ul className="flex items-center gap-6 lg:gap-8">
              {NAV_LINKS.map((link) => {
                const active = isNavLinkActive(link, pathname, section);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`border-b-2 py-1 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${active ? link.activeClassName : `border-transparent ${link.hoverClassName}`}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {NAV_RESUME && (
            <ResumeButton href={NAV_RESUME.href} label={NAV_RESUME.label} />
          )}
        </div>

        <MobileNav
          links={NAV_LINKS}
          resume={NAV_RESUME}
          pathname={pathname}
          section={section}
        />
      </div>
    </header>
  );
}
