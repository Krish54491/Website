import type { ProjectPage } from "../projectsConfig";

const chipmunk: ProjectPage = {
  name: "Chipmunk",
  role: "Machine Learning Developer",
  period: "Feburary 2025",
  techStack: ["JavaScript", "HTML", "CSS", "GitHub Pages"],
  links: [
    {
      name: "Devpost",
      link: "https://devpost.com/software/chipmunk",
    },
    {
      name: "Visit site",
      link: "https://krish54491.github.io/Krish54491-chipmunk/",
    },
  ],
  summary: `We noticed that during presentations, speakers would often lose momentum when they had to change slides, and we saw an opportunity to improve the slide transitions, and eventually, the whole process. We have devised a straight-forward presentation system; using technology so you don't have to worry about technology.

We built the project around three main ways of interacting with a PDF without needing to touch your computer. For gesture controls, we tracked and mapped hand coordinates, then compared the positions of different points to detect when a user's hand closed and turn the page after the gesture was held. We also used the Web Speech API to continuously listen for customizable voice commands, allowing users to move forward or backward through the PDF while displaying what they said as live subtitles. Finally, we used the MediaRecorder API to capture the user's webcam and screen during a presentation, combining everything into a recording that could be saved afterward. Together, these features let someone control and record an entire presentation using primarily their voice and hand gestures.`,
  highlights: [
    "Won 3rd Place at Hacklahoma 2025, earning $1,000+ in prizes.",
    "Built hands-free presentation controls using real-time hand tracking and customizable voice commands.",
    "Implemented live subtitles and automatic session recording using the Web Speech and MediaRecorder APIs.",
  ],
  architecture: [
    {
      label: "Inputs",
      nodes: [{ title: "Webcam" }, { title: "Microphone" }],
    },
    {
      nodes: [
        { title: "Hand Tracking", description: "TensorFlow.js" },
        {
          title: "Subtitles and Voice Commands",
          description: "Web Speech API",
        },
        { title: "Presentation Recording", description: "MediaRecorder API" },
      ],
    },

    {
      label: "Interface",
      nodes: [{ title: "Chipmunk" }],
    },
  ],
};

export default chipmunk;
