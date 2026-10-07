export const HERO = {
  name: "Krish Bharal",
  nickname: "Krish544",
  descriptor: "Fullstack Developer",
  tagline: "A Computer Engineer That Loves Coding Too Much",
  avatar: "/Krish544 Icon.png",
};

export const ABOUT: string[] = [
  `Hey there, I'm Krish Bharal I love making programs and tools that I personally use! Currently I'm a junior at the University of Texas at Dallas working toward a degree in Computer Engineering. I'm primarily software oriented with a bit experience in everything: Embedded, Frontend, Backend, Cloud, AI/ML, you name it I have experience with it.`,
  `My strongest areas are frontend development with React and Tailwind CSS\n(as you can probably tell), AI/ML with Python, and backend development primarily with Node.js and PostgreSQL! That said, I like being able to jump between different parts of a project and learning whatever I need to build something from start to finish.`,
];

export const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "Java", "Rust", "C++"],
  },
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "React Router",
      "Vite",
      "Dioxus",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "Supabase",
      "Drizzle ORM",
      "Selenium",
      "Playwright",
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      "Cloudflare",
      "Google Cloud Platform",
      "Docker",
      "GitHub Actions",
      "Git",
      "Linux",
    ],
  },
  {
    category: "AI / ML",
    items: ["TensorFlow", "MediaPipe", "OpenCV", "Pandas"],
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
