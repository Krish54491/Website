type Card = {
  id: string;
  name: string;
  description: string;
  path: string;
  lightThumbnail?: () => Promise<{ default: string }>; // only making optional for testing
  darkThumbnail?: () => Promise<{ default: string }>; // only making optional for testing
  mobile?: boolean; // default to true
};

export const tools: Card[] = [
  {
    id: "countdown",
    name: "Countdown Timer",
    description: "A simple countdown timer for your needs.",
    path: "/countdown",
    darkThumbnail: () => import("../assets/tools/thumbnails/Countdown.png"),
    mobile: true,
  },
  {
    id: "todo",
    name: "To-Do List",
    description: "A simple to-do list for your needs.",
    path: "/todo",
    darkThumbnail: () => import("../assets/tools/thumbnails/ToDoList.png"),
    mobile: true,
  },
  {
    id: "videotranslator",
    name: "Video Translator",
    description: "Translate videos with ease.",
    path: "/videotranslator",
    darkThumbnail: () =>
      import("../assets/tools/thumbnails/VideoTranslator.png"),
    mobile: true,
  },
  {
    id: "videorater",
    name: "Video Rater",
    description: "Rate and review videos with ease.",
    path: "/videorater",
    darkThumbnail: () => import("../assets/tools/thumbnails/VideoRater.png"),
    mobile: true,
  },
  {
    id: "baseconverter",
    name: "Base Converter",
    description:
      "Convert between different numberical bases(e.g binary, decimal, hexadecimal).",
    path: "/baseconverter",
    darkThumbnail: () => import("../assets/tools/thumbnails/BaseConverter.png"),
    mobile: true,
  },
];
