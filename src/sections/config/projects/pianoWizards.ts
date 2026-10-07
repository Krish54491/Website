import type { ProjectPage } from "../projectsConfig";

const pianoWizards: ProjectPage = {
  name: "Piano Wizards",
  role: "Backend Developer",
  period: "February 2026",
  techStack: ["React", "TypeScript", "Tailwind", "Cloudflare Pages"],
  links: [
    {
      name: "Devpost",
      link: "https://devpost.com/software/piano-wizards",
    },
    { name: "Visit site", link: "https://pianowizards.krish544.com" },
  ],
  summary: `At the beginning we started defining the prompt, our thoughts were mostly about what would help someone learn while having fun. From that we thought of two main ideas of a handwriting aid that's one continuous motion of writing letters, and a piano dueling game that was similar to horse in order to build playing speed and comfort in recognizing notes. Then for the theme we decided on wizards because we came to Hacklahoma dressed as wizards and we wanted to incorporate it.

  Piano Wizards is a game where two players play a game where they repeat the last move the opposing player did then making their own move and vice versa until one fails enough to spell the word MAGIC. 

  We built Piano Wizards as a full-stack multiplayer game, splitting the project into a client and server connected through WebSockets. The server acts as the referee, managing isolated two-player rooms, turns, recorded melodies, and game state while comparing each player's attempt with some tolerance for timing and note mistakes.

 On the client side, we built the piano and UI using vanilla HTML, CSS, and JavaScript, supporting both keyboard and MIDI input and mapping each input to its corresponding piano sound. We also tracked the timing of each note and converted the recorded melodies into sheet music so players could see what they were hearing. From there, the client and server pass events back and forth to keep both players synchronized throughout the game, from joining a room all the way to someone spelling MAGIC and losing.`,
  highlights: [
    "Architected and deployed a real-time multiplayer piano game with isolated room management, synchronized client-server state, and low-latency WebSockets communication.",
    "Designed a fault-tolerant turn-based game engine with backend state transitions and custom melody validation (±300 ms timing tolerance).",
  ],
  architecture: [
    {
      nodes: [
        {
          title: "Frontend",
          description: "React.js - Frontpage - Inputs - Sheet Music Display",
        },
      ],
    },
    {
      nodes: [
        {
          title: "Backend",
          description: "node.js - WebSockets -  Room Management - Game Control",
        },
      ],
    },

    { nodes: [{ title: "Hosting", description: "Railway" }] },
  ],
};

export default pianoWizards;
