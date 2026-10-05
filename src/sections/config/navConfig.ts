// what shows up in the nav bar(desktop and mobile)
// each link uses the colors of the section it goes to: hover/active turns into that section's primary color
// class strings have to be written out in full so tailwind can find them
import { krish_resume } from "../utils/constants";
import type { NavLinkItem } from "../navigation/types";

export const NAV_BRAND = {
  label: "Krish544",
  to: "/",
};

export const NAV_LINKS: NavLinkItem[] = [
  {
    label: "Games",
    to: "/games",
    section: "games",
    hoverClassName:
      "hover:text-games-light-primary dark:hover:text-games-dark-primary",
    activeClassName:
      "text-games-light-primary border-games-light-primary dark:text-games-dark-primary dark:border-games-dark-primary",
    numberClassName: "text-games-light-primary dark:text-games-dark-primary",
  },
  {
    label: "Tools",
    to: "/tools",
    section: "tools",
    hoverClassName:
      "hover:text-tools-light-primary dark:hover:text-tools-dark-primary",
    activeClassName:
      "text-tools-light-primary border-tools-light-primary dark:text-tools-dark-primary dark:border-tools-dark-primary",
    numberClassName: "text-tools-light-primary dark:text-tools-dark-primary",
  },
  {
    label: "Projects",
    to: "/projects",
    section: "projects",
    hoverClassName:
      "hover:text-projects-light-primary dark:hover:text-projects-dark-primary",
    activeClassName:
      "text-projects-light-primary border-projects-light-primary dark:text-projects-dark-primary dark:border-projects-dark-primary",
    numberClassName:
      "text-projects-light-primary dark:text-projects-dark-primary",
  },
  {
    // home's light primary is a pale yellow that's hard to read as text, so light mode text uses the purple accent instead
    label: "Account",
    to: "/account",
    paths: ["/account", "/login", "/register", "/tos"],
    hoverClassName:
      "hover:text-home-light-accent dark:hover:text-home-dark-primary",
    activeClassName:
      "text-home-light-accent border-home-light-primary dark:text-home-dark-primary dark:border-home-dark-primary",
    numberClassName: "text-home-light-accent dark:text-home-dark-primary",
  },
];

export const NAV_RESUME = {
  label: "Resume",
  href: `/${krish_resume}`,
};
