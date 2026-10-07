// Everything below is PLACEHOLDER content for the front page
export const HERO = {
  name: "Krish Bharal",
  nickname: "Krish544",
  descriptor: "Fullstack Developer",
  tagline: "A Computer Engineer That Loves Coding Too Much",
  avatar: "/Krish544 Icon.png", // from /public
};

export const ABOUT: string[] = [
  `Hey there, I'm Krish Bharal I love making things
  PLACEHOLDER: First paragraph about yourself, where you are, what you study or work on.`,
  "PLACEHOLDER: Second paragraph about what you enjoy outside of code (Pokemon, Jolteon, etc).",
];

// Placeholder:
export const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
  },
  { category: "Frontend", items: ["React", "Tailwind CSS", "Vite"] },
  {
    category: "Backend",
    items: [
      "Cloudflare Pages Functions",
      "PostgreSQL",
      "Drizzle ORM",
      "Supabase",
    ],
  },
];

// whatever I'm currently working on or doing
// placeholder
// export const CURRENTLY_WORKING : {
//   images: string[];
//   summmary: string;
// }

// Some events or things I've done that I'm proud of that I want to be shown(this could either be personal or professional)
//Placeholder
// export const SNAPSHOTS_OF_ME: {
//   image:string;
//   title:string;
//   shortSummary: string;
// } = {

// }

// Placeholder:
export const PROJECT_SHOWCASE: {
  title: string;
  image: string;
  summary: string; // very short like a line
  skillsUsed: {
    image: string; // svgs or just
    name: string;
  }[];
  external?: {
    linkName: string;
    link: string;
  }[];
} = {
  title: "Chipmunk",
  image: "",
  summary:
    "Chipmunk is a presentation helper that uses ML to make your experience seamless",
  skillsUsed: [
    {
      image: "",
      name: "JavaScript",
    },
    {
      image: "",
      name: "Tailwind CSS",
    },
    {
      image: "",
      name: "Tensorflow",
    },
  ],
};
