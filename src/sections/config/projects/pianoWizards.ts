import type { ProjectPage } from "../projectsConfig";

// PLACEHOLDER content, replace with the real case study
const pianoWizards: ProjectPage = {
  name: "Piano Wizards",
  role: "PLACEHOLDER: Frontend Developer",
  period: "PLACEHOLDER: 2025 - Present",
  techStack: ["React", "TypeScript", "Tailwind", "Cloudflare Pages"],
  links: [{ name: "Visit site", link: "https://pianowizards.krish544.com" }],
  summary: `PLACEHOLDER: First paragraph explaining what the project is, who it was built for, and the problem it solves.

PLACEHOLDER: Second paragraph about how it was built and the interesting decisions along the way.`,
  highlights: [
    "PLACEHOLDER: Most impressive thing you built.",
    "PLACEHOLDER: A measurable result or scale number.",
    "PLACEHOLDER: An interesting technical challenge you solved.",
  ],
  architecture: [
    { nodes: [{ title: "Frontend", description: "PLACEHOLDER: React app" }] },
    {
      label: "Features",
      nodes: [
        { title: "Feature A", description: "PLACEHOLDER" },
        { title: "Feature B", description: "PLACEHOLDER" },
        { title: "Feature C" },
      ],
    },
    { nodes: [{ title: "Hosting", description: "PLACEHOLDER: Cloudflare" }] },
  ],
};

export default pianoWizards;
