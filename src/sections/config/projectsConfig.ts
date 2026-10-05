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

export const PROJECT_CARDS: ProjectCard[] = [
  {
    name: "Piano Wizards",
    summary:
      "PLACEHOLDER: one or two sentences about what Piano Wizards is and who it was for.",
    techStack: ["React", "TypeScript", "Tailwind"],
    image: placeholderImage,
    path: "pianoWizards",
  },
  {
    name: "Chipmunk",
    summary:
      "PLACEHOLDER: one or two sentences about what Chipmunk is and who it was for.",
    techStack: ["JavaScript", "HTML", "CSS"],
    image: placeholderImage,
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
