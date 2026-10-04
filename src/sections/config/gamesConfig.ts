type Card = {
  id: string;
  name: string;
  description: string;
  path: string;
  lightThumbnail?: () => Promise<{ default: string }>; // only making optional for testing
  darkThumbnail?: () => Promise<{ default: string }>; // only making optional for testing
  mobile?: boolean; // default to true
};

export const games: Card[] = [
  {
    id: "ultimatetictactoe",
    name: "Ultimate Tic Tac Toe",
    description:
      "A more complex version of tic tac toe where you have to win 3 boards to win the game.",
    path: "/ultimatetictactoe",
    darkThumbnail: () =>
      import("../assets/games/thumbnails/Ultimate Tic-Tac-Toe.png"),
    mobile: true,
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "The classic tic tac toe game. Get three in a row to win!",
    path: "/tictactoe",
    darkThumbnail: () => import("../assets/games/thumbnails/Tic-Tac-Toe.png"),
    mobile: true,
  },
  {
    id: "mouse",
    name: "Mouse Game",
    description: "Control your mouse and try to survive the projectiles!",
    path: "/mouse",
    darkThumbnail: () => import("../assets/games/thumbnails/Mouse Game.png"),
    mobile: false,
  },
];
