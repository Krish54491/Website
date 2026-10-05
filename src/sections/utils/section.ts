// which core section(and color scheme) a path belongs to, shared by App and the nav
import { tools } from "../config/toolsConfig";
import { games } from "../config/gamesConfig";

export type Section = "home" | "games" | "tools" | "projects";

const gamePaths = [
  "/games",
  "/clicker",
  "/pokedex",
  "/surveyspire",
  ...games.map((game) => game.path),
];
const toolPaths = ["/tools", ...tools.map((tool) => tool.path)];

export function getSection(pathname: string): Section {
  const path = pathname.toLowerCase().replace(/\/$/, "") || "/";
  if (gamePaths.includes(path) || path.startsWith("/games/")) return "games";
  if (toolPaths.includes(path) || path.startsWith("/tools/")) return "tools";
  if (path === "/projects" || path.startsWith("/projects/")) return "projects";
  return "home";
}
