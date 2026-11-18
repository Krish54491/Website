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

// Skills section:
export type SkillGroup = { category: string; items: string[] };

// one entry per dealt tarot card, in the order they're dealt (left to right).
// the skills depend on the slot, not on which arcana gets drawn
export const SKILL_CARDS: { title: string; groups: SkillGroup[] }[] = [
  {
    title: "Software",
    groups: [
      {
        category: "Languages",
        items: [
          "Python",
          "TypeScript",
          "JavaScript",
          "SQL",
          "Java",
          "Rust",
          "C++",
          "C",
        ],
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
          "WebSockets",
          "Selenium",
          "Playwright",
        ],
      },
    ],
  },
  {
    title: "Hardware",
    groups: [
      {
        category: "Embedded",
        items: [
          "ARM Cortex-M",
          "MSP432",
          "ESP32-S3",
          "Arduino",
          "GPIO",
          "ADC",
          "PWM",
          "BLE GATT",
          "Nonvolatile Storage",
        ],
      },
      {
        category: "Robotics",
        items: ["ROS 2 Jazzy", "Move it 2"],
      },
      {
        category: "Design & Test",
        items: [
          "Verilog",
          "Digital Logic",
          "PCB Design",
          "OrCAD / Allegro",
          "LTspice",
          "PSpice",
          "Oscilloscopes",
          "Logic Analyzers",
        ],
      },
    ],
  },
  {
    title: "Other",
    groups: [
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
        items: [
          "TensorFlow",
          "MediaPipe",
          "OpenCV",
          "Pandas",
          "Computer Vision",
        ],
      },
    ],
  },
];

// every group in one flat list, used by the "view all skills" fallback
export const SKILLS: SkillGroup[] = SKILL_CARDS.flatMap((card) => card.groups);

import type { Arcana } from "./types";

export const ARCANA: Arcana[] = [
  {
    image: () => import("../../assets/home/tarot/arcana/fool.webp"),
    name: "The Fool",
    numeral: "0",
    description:
      "New beginnings and infinite potential. The Fool steps forward without knowing the road, trusting that curiosity will carry the journey.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/magician.webp"),
    name: "The Magician",
    numeral: "I",
    description:
      "Skill, willpower and resourcefulness. The Magician has every tool laid out on the table and the focus to turn an idea into something real.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/priestess.webp"),
    name: "The High Priestess",
    numeral: "II",
    description:
      "Intuition and hidden knowledge. The High Priestess listens before acting and trusts what is understood beneath the surface.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/empress.webp"),
    name: "The Empress",
    numeral: "III",
    description:
      "Creation, abundance and care. The Empress nurtures whatever she touches until it grows into something greater.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/emperor.webp"),
    name: "The Emperor",
    numeral: "IV",
    description:
      "Structure, leadership and stability. The Emperor builds order out of chaos and takes responsibility for what he builds.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/hierophant.webp"),
    name: "The Hierophant",
    numeral: "V",
    description:
      "Tradition, mentorship and learning. The Hierophant passes on what works and respects the foundations others laid down.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/lovers.webp"),
    name: "The Lovers",
    numeral: "VI",
    description:
      "Connection and choice. The Lovers is about committing fully to a path and the harmony that comes from that commitment.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/chariot.webp"),
    name: "The Chariot",
    numeral: "VII",
    description:
      "Determination and victory. The Chariot pulls opposing forces in one direction through sheer discipline and drive.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/justice.webp"),
    name: "Justice",
    numeral: "VIII",
    description:
      "Fairness, truth and cause and effect. Justice weighs every decision carefully and owns the outcome.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/hermit.webp"),
    name: "The Hermit",
    numeral: "IX",
    description:
      "Introspection and the search for wisdom. The Hermit steps away from the noise to study deeply, then carries the lantern back for others.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/fortune.webp"),
    name: "Wheel of Fortune",
    numeral: "X",
    description:
      "Cycles, luck and turning points. The Wheel never stops, so the best move is to adapt quickly when it turns.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/strength.webp"),
    name: "Strength",
    numeral: "XI",
    description:
      "Courage, patience and quiet control. Strength tames the hard problem with persistence rather than force.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/hanged.webp"),
    name: "The Hanged Man",
    numeral: "XII",
    description:
      "Pause, surrender and a new perspective. The Hanged Man solves the problem by looking at it upside down.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/death.webp"),
    name: "Death",
    numeral: "XIII",
    description:
      "Endings that make room for transformation. Death clears away what no longer works so something better can replace it.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/temperance.webp"),
    name: "Temperance",
    numeral: "XIV",
    description:
      "Balance, moderation and blending. Temperance mixes opposing things in the right amounts until they work together.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/devil.webp"),
    name: "The Devil",
    numeral: "XV",
    description:
      "Temptation and attachment. The Devil is a reminder of the chains we choose, and that they can be taken off.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/tower.webp"),
    name: "The Tower",
    numeral: "XVI",
    description:
      "Sudden upheaval and revelation. The Tower falls when it was built on something shaky, leaving solid ground to rebuild on.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/star.webp"),
    name: "The Star",
    numeral: "XVII",
    description:
      "Hope, renewal and inspiration. The Star is the calm after the storm and the faith that the work will pay off.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/moon.webp"),
    name: "The Moon",
    numeral: "XVIII",
    description:
      "Illusion, uncertainty and the subconscious. The Moon asks you to keep walking even when the path is only half lit.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/sun.webp"),
    name: "The Sun",
    numeral: "XIX",
    description:
      "Joy, success and clarity. The Sun is everything going right and the energy to share it.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/judgement.webp"),
    name: "Judgement",
    numeral: "XX",
    description:
      "Reflection, reckoning and awakening. Judgement looks back honestly at the journey and answers the call to what comes next.",
    major: true,
  },
  {
    image: () => import("../../assets/home/tarot/arcana/world.webp"),
    name: "The World",
    numeral: "XXI",
    description:
      "Completion and wholeness. The World is the end of one journey, with everything learned along the way ready for the next.",
    major: true,
  },
];

// one stop on the home page timeline (work history, education, and some projects together)
export type TimelinePin = {
  type: "project" | "education" | "job" | "club"; // picks the pin icon/color
  name: string; // job title, degree, or project name
  organization?: string; // company, school, or event, shown under the name
  timeStart: string; // "YYYY-MM", the timeline is sorted by this
  timeEnd?: string; // "YYYY-MM", leave out if still going with no clear end date (shows "Present")
  location?: string; // where it was, not needed if remote
  skills: string[]; // skills associated
  // bullet points about the job or project, projects have none unless worked on with a team for a long time
  // (not a hackathon), education doesn't need any either
  highlights?: string[];
  image?: string; // imported image url, only for education 99% of the time
  link?: string; // "/projects/<slug>" for a case study or a full https url, shows as a small arrow by the name
};

// order doesn't matter here, the timeline sorts by timeStart (oldest first)
export const TIMELINE: TimelinePin[] = [
  {
    type: "education",
    name: "B.S. Computer Engineering",
    organization: "The University of Texas at Dallas",
    timeStart: "2024-08",
    timeEnd: "2027-12",
    location: "Richardson, TX",
    skills: [
      "Data Structures & Algorithms",
      "Computer Architecture",
      "Digital Circuits",
      "Embedded Systems",
      "Artificial Intelligence",
    ],
  },
  {
    type: "project",
    name: "Personal Portfolio",
    organization: "krish544.com",
    timeStart: "2024-11",
    skills: [
      "React",
      "TypeScript",
      "Cloudflare",
      "Supabase",
      "Drizzle ORM",
      "GitHub Actions",
    ],
  },
  {
    type: "job",
    name: "Software Engineering Intern",
    organization: "Care Impact",
    timeStart: "2025-06",
    timeEnd: "2025-08",
    location: "Leander, TX",
    skills: ["Python", "Selenium", "PostgreSQL"],
    highlights: [
      "Designed and deployed a Python-based pipeline using Selenium to automate retrieval of patient medical records from a client portal, supporting device recommendation workflows.",
      "Automated migration of 5,000+ patient records into Care Impact's databases, replacing manual data-entry, saving $10,000+ in costs by creating a reusable data pipeline.",
    ],
  },
  {
    type: "job",
    name: "Frontend Developer",
    organization: "Comet Aviation",
    timeStart: "2026-08",
    timeEnd: "2026-10",
    location: "Richardson, TX",
    skills: ["React", "TypeScript", "Cloudflare"],
    highlights: [
      "Developed and maintained Comet Aviation's web platform using React and TypeScript, building responsive components and event-management functionality for the organization's public-facing website.",
      "Managed the development lifecycle with non-technical club leadership, translating requirements into technical specifications and delivering documented, production-ready features deployed through Cloudflare.",
    ],
  },
  {
    type: "project",
    name: "Piano Wizards",
    organization: "Hacklahoma 2026 · 1st Place",
    timeStart: "2026-02",
    timeEnd: "2026-02",
    skills: ["React", "JavaScript", "WebSockets"],
    link: "/projects/pianoWizards",
  },
  {
    type: "project",
    name: "Hand Gesture Recognition Platform",
    timeStart: "2026-05",
    timeEnd: "2026-09",
    skills: ["Python", "MediaPipe", "PostgreSQL", "Rust", "Dioxus", "FastAPI"],
    link: "https://github.com/Krish54491/Hand-Recognizer",
  },
];

// whatever I'm currently working on or doing, PERSONAL
// placeholder
// export const CURRENTLY_WORKING : {
//   images: string[];
//   summmary: string;
// }

// Some events or things I've done that I'm proud of that I want to be shown(personal)
// Placeholder
// export const SNAPSHOTS_OF_ME: {
//   image:string;
//   title:string;
//   shortSummary: string;
// } = {

// }
// Projects section:
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
