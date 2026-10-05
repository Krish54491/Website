import type { Section } from "../utils/section";

export type NavLinkItem = {
  label: string;
  to: string;
  section?: Section; // active whenever the current page is in this section
  paths?: string[]; // or active on exactly these paths
  hoverClassName: string;
  activeClassName: string; // needs a text and border color
  numberClassName: string; // color of the 01. 02. numbers in the mobile menu
};

export function isNavLinkActive(
  link: NavLinkItem,
  pathname: string,
  section: Section,
) {
  if (link.section) return link.section === section;
  const path = pathname.toLowerCase().replace(/\/$/, "") || "/";
  return link.paths?.includes(path) ?? path === link.to;
}
