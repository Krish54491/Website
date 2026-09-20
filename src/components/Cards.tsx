// this component will be the main page for features(games or tools), it will show all of games/tools and a search bar(eventually) to filter them
// a square that shows a thumbnail of the game and its name, clicking on it will take you to the game page
// hovering over the thumbnail will show a preview video of the game
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface Item {
  id: string;
  name: string;
  description: string;
  path: string;
  thumbnail: () => Promise<{ default: string }>;
  video: string | (() => Promise<{ default: string }>);
  mobile: boolean;
}

function Card({ item }: { item: Item }) {
  const [isHovering, setIsHovering] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load thumbnail dynamically when component mounts
  useEffect(() => {
    if (typeof item.thumbnail === "function") {
      item.thumbnail().then((module) => {
        setThumbnailUrl(module.default);
      });
    } else {
      setThumbnailUrl(item.thumbnail);
    }

    if (typeof item.video === "string") {
      if (videoRef.current) {
        videoRef.current.src = item.video;
      }
      return;
    }
    item.video().then((module) => {
      // Use module.default for the video URL
      if (videoRef.current) {
        videoRef.current.src = module.default;
      }
    });
  }, [item]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && item.video) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch((err) => console.error("Video play failed:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={item.path}
      className={`${item.mobile ? "" : "hidden md:block"} group relative overflow-hidden rounded-lg border-black dark:border-white border-2 bg-cyan-500 dark:bg-blue-800 hover:bg-cyan-600 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black transition-colors duration-200`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-400 dark:bg-gray-700 ">
        <img
          src={thumbnailUrl}
          alt={item.name}
          className={`h-full w-full object-cover transition-opacity duration-200 ${
            item.video && isHovering ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* Video - shown on hover */}
        <video
          ref={videoRef}
          // src={item.video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            item.video && isHovering ? "opacity-100" : "opacity-0"
          }`}
          preload="none"
          muted
          loop
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 ">{item.name}</h2>
        <p className="hidden sm:block text-sm ">{item.description}</p>
      </div>
    </Link>
  );
}

export default function CardMain({
  items = [],
  listName = "How?",
}: {
  items: Item[];
  listName: string;
}) {
  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-4 text-center my-2">{listName}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
        {items && items.length > 0 ? (
          items.map((item) => <Card key={item.id} item={item} />)
        ) : (
          <p>{listName ? `No ${listName}` : "Error!"}</p>
        )}
      </div>
    </div>
  );
}

/*
// this component will be the main page for games, it will show all of games and a search bar to filter them
// a square that shows a thumbnail of the game and its name, clicking on it will take you to the game page
// hovering over the thumbnail will show a preview video of the game
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
//thumbnails:
import UltimateTicTacToeThumbnail from "../assets/games/thumbnails/Ultimate Tic-Tac-Toe.png";
import TicTacToeThumbnail from "../assets/games/thumbnails/Tic-Tac-Toe.png";
import MouseGameThumbnail from "../assets/games/thumbnails/Mouse Game.png";
import SidewaysSamThumbnail from "../assets/games/thumbnails/Sideways Sam.png";

// videos:
// import UltimateTicTacToeVideo from "../assets/games/videos/Now Let me be Clear.mp4";
// import TicTacToeVideo from "../assets/games/videos/tic-tac-toe.mp4";
// import MouseGameVideo from "../assets/games/videos/mouse-game.mp4";
// import SidewaysSamVideo from "../assets/games/videos/sideways-sam.mp4";
const games = [
  {
    id: "ultimatetictactoe",
    name: "Ultimate Tic Tac Toe",
    description:
      "A more complex version of tic tac toe where you have to win 3 boards to win the game.",
    path: "/ultimatetictactoe",
    thumbnail: "../assets/games/thumbnails/Ultimate Tic-Tac-Toe.png",
    video: "../assets/games/videos/ultimate Tic-Tac-Toe.mp4",
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "The classic tic tac toe game. Get three in a row to win!",
    path: "/tictactoe",
    thumbnail: "../assets/games/thumbnails/Tic-Tac-Toe.png",
    video: "../assets/games/videos/tic-tac-toe.mp4",
  },
  {
    id: "mouse",
    name: "Mouse Game",
    description: "Control your mouse and try to survive the projectiles!",
    path: "/mouse",
    thumbnail: "../assets/games/thumbnails/Mouse Game.png",
    video: "../assets/games/videos/mouse-game.mp4",
  },
  {
    id: "sidewayssam",
    name: "Sideways Sam",
    description: "Help Sam dodge rocks and avoid a concussion!",
    path: "/sidewayssam",
    thumbnail: "../assets/games/thumbnails/Sideways Sam.png",
    video: "../assets/games/videos/sideways-sam.mp4",
  },
];
function GameCard({ game }) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch((err) => console.error("Video play failed:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={game.path}
      className="group relative overflow-hidden rounded-lg bg-cyan-500 dark:bg-blue-800 hover:bg-cyan-600 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black transition-colors duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-400 dark:bg-gray-700">
        <img
          src={game.thumbnail}
          alt={game.name}
          className={`h-full w-full object-cover transition-opacity duration-200 ${
            isHovering ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={videoRef}
          src={game.video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 ">{game.name}</h2>
        <p className="hidden sm:block text-sm ">{game.description}</p>
      </div>
    </Link>
  );
}

export default function GamesMain({ games = [], listName = "Games" }) {
  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-4  text-center my-2">{listName}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
        {list.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

*/
