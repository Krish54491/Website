import placeholderImage from "../../assets/tools/thumbnails/Placeholder Image.png";

export type ProjectCard = {
  // what shows on the general project page
  name: string;
  summary: string; // short summary of project
  techStack: string[]; // 2 - 5 tools/languages used in the creation of this Ex. Typescript, React, Cloudflare pages, Tailwind, Postgresql
  image: string; // path to image
  path: string; // slug for the case study, the card links to /projects/<path> E.g "pianoWizards"
};

type ArchitectureNode = {
  title: string;
  description?: string;
};

export type ArchitectureStage = {
  label?: string;
  nodes: ArchitectureNode[];
};

export type ProjectLink = {
  // for any links related to project Ex. name:github link: github.com
  name: string;
  link: string;
};

export type ProjectPage = {
  // the actual detailed project info
  name: string;
  role: string; // what I did in it
  period: string; // from when I started to ended(can end at present)
  techStack: string[]; // More lengthy version of the one for just the card
  links?: ProjectLink[];
  summary: string; // multi line string detailing the project 2 - 3 paragraphs, separate paragraphs with a blank line
  highlights: string[]; // bullet points(resume style) of the most important/cool bits
  architecture: ArchitectureStage[];
};

// To add a project:
// 1. add its card to PROJECT_CARDS
// 2. make ./projects/<path>.ts that default exports a ProjectPage
// 3. add the <path> line to PROJECT_PAGES
// Pages are lazy loaded so each case study is its own small chunk and only downloads when opened
import PianoWizardsImage from "../../assets/projects/Piano Wizards.png";
import ChipmunkImage from "../../assets/projects/Chipmunk.jpg";
export const PROJECT_CARDS: ProjectCard[] = [
  // order is from newest to oldest for now
  {
    name: "Piano Wizards",
    summary:
      "Hacklahoma 2026 1st Place Winner - A piano learning game that challenges you to match your opponent's wavelength. Improve your skills through fierce competition and repetition!  ",
    techStack: ["React", "JavaScript", "Tailwind"],
    image: PianoWizardsImage,
    path: "pianoWizards",
  },
  {
    name: "Chipmunk",
    summary:
      "Hacklahoma 2025 3rd Place Winner - An unobtrusive assistant to make presentations effortless for the user. Contactless slide navigation, live subtitles, and automatic recording.",
    techStack: ["JavaScript", "HTML", "CSS"],
    image: ChipmunkImage,
    path: "chipmunk",
  },
];

export const PROJECT_PAGES: Record<
  string,
  () => Promise<{ default: ProjectPage }>
> = {
  pianoWizards: () => import("./projects/pianoWizards"),
  chipmunk: () => import("./projects/chipmunk"),
};
