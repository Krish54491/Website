type ProjectCard = {
  // what shows on the general project page
  name: string;
  summary: string; // short summary of project
  techStack: string[]; // 2 - 5 tools/languages used in the creation of this Ex. Typescript, React, Cloudflare pages, Tailwind, Postgresql
  image: string; // path to image
  path: string; // this one is iffy, but where the the card links to E.g /piano-wizards for piano wizards summary
};

type ArchitectureNode = {
  title: string;
  description?: string;
};

type ArchitectureStage = {
  label?: string;
  nodes: ArchitectureNode[];
};

type ProjectPage = {
  // the actual detailed project info
  name: string;
  role: string; // what I did in it
  period: string; // from when I started to ended(can end at present)
  techStack: string[]; // More lengthy version of the one for just the card
  links?: {
    // for any links related to project Ex. name:github link: github.com , and you can add others
    name: string;
    link: string;
  };
  summary: string; // multi line string detailing the project 2 - 3 paragraphs
  highlights: string[]; // bullet points(resume style) of the most important/cool bits
  architecture: ArchitectureStage[];
};

// edit this to make show a new project and add its page
// Don't know whether to separate them for faster loading or maybe make PROJECT_PAGES a map that takes in name which the component can later
// the actual variables are gonna be arrays fill with placeholders for now

// const PROJECT_CARDS:ProjectCard[] = ;
// const PROJECT_PAGES:ProjectPage[] = ;
