type Card = {
  id: string;
  name: string;
  description: string;
  path: string;
  thumbnail: () => Promise<{ default: string }>;
  video: string | (() => Promise<{ default: string }>);
  mobile: boolean;
};

export const games: Card[] = [
  {
    id: "ultimatetictactoe",
    name: "Ultimate Tic Tac Toe",
    description:
      "A more complex version of tic tac toe where you have to win 3 boards to win the game.",
    path: "/ultimatetictactoe",
    thumbnail: () =>
      import("../assets/games/thumbnails/Ultimate Tic-Tac-Toe.png"),
    video: () => import("../assets/games/videos/ultimate Tic-Tac-Toe.mp4"),
    mobile: true,
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "The classic tic tac toe game. Get three in a row to win!",
    path: "/tictactoe",
    thumbnail: () => import("../assets/games/thumbnails/Tic-Tac-Toe.png"),
    video: () => import("../assets/games/videos/tic-tac-toe.mp4"),
    mobile: true,
  },
  {
    id: "mouse",
    name: "Mouse Game",
    description: "Control your mouse and try to survive the projectiles!",
    path: "/mouse",
    thumbnail: () => import("../assets/games/thumbnails/Mouse Game.png"),
    video: () => import("../assets/games/videos/mouse-game.mp4"),
    mobile: false,
  },
  {
    id: "sidewayssam",
    name: "Sideways Sam",
    description: "Help Sam dodge rocks and avoid a concussion!",
    path: "/sidewayssam",
    thumbnail: () => import("../assets/games/thumbnails/Sideways Sam.png"),
    video: () => import("../assets/games/videos/sideways-sam.mp4"),
    mobile: true,
  },
];
export const tools: Card[] = [
  {
    id: "countdown",
    name: "Countdown Timer",
    description: "A simple countdown timer for your needs.",
    path: "/countdown",
    thumbnail: () => import("../assets/tools/thumbnails/Countdown.png"),
    video: () => import("../assets/tools/videos/countdown.mp4"),
    mobile: true,
  },
  {
    id: "todo",
    name: "To-Do List",
    description: "A simple to-do list for your needs.",
    path: "/todo",
    thumbnail: () => import("../assets/tools/thumbnails/ToDoList.png"),
    video: () => import("../assets/tools/videos/todo.mp4"),
    mobile: true,
  },
  {
    id: "videotranslator",
    name: "Video Translator",
    description: "Translate videos with ease.",
    path: "/videotranslator",
    thumbnail: () => import("../assets/tools/thumbnails/VideoTranslator.png"),
    video: () => import("../assets/tools/videos/videotranslator.mp4"),
    mobile: true,
  },
  {
    id: "videorater",
    name: "Video Rater",
    description: "Rate and review videos with ease.",
    path: "/videorater",
    thumbnail: () => import("../assets/tools/thumbnails/VideoRater.png"),
    video: () => import("../assets/tools/videos/videorater.mp4"),
    mobile: true,
  },
  {
    id: "baseconverter",
    name: "Base Converter",
    description:
      "Convert between different numberical bases(e.g binary, decimal, hexadecimal).",
    path: "/baseconverter",
    thumbnail: () => import("../assets/tools/thumbnails/BaseConverter.png"),
    video: () => import("../assets/tools/videos/baseconverter.mp4"),
    mobile: true,
  },
];
// Config for my External links
export const krish_resume = "Krish_Bharal - Resume.pdf";
export const chipmunk = "https://krish54491.github.io/Krish54491-chipmunk/";
export const pianowizards = "https://pianowizards.krish544.com";
// Config for games and tools - easily modifiable
export const GAMESNAV = [
  { label: "Tic-Tac-Toe", path: "/tictactoe" },
  { label: "Mouse Game", path: "/mouse" },
  { label: "Sideways Sam", path: "/sidewayssam" },
  { label: "Ultimate Tic-Tac-Toe", path: "/ultimatetictactoe" },
];

export const TOOLSNAV = [
  { label: "Countdown", path: "/countdown" },
  { label: "To-Do", path: "/todo" },
  { label: "Video Translator", path: "/videotranslator" },
  { label: "Video Rater", path: "/videorater" },
  { label: "Base Converter", path: "/baseconverter" },
];
