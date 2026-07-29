import { useState } from "react";
import { Link } from "react-router-dom";

// Config for my External links
const krish_resume = "Krish_Bharal - Resume.pdf";
const chipmunk = "https://krish54491.github.io/Krish54491-chipmunk/";
const pianowizards = "https://pianowizards.krish544.com";
// Config for games and tools - easily modifiable
const GAMES = [
  { label: "Tic-Tac-Toe", path: "/tictactoe" },
  { label: "Mouse Game", path: "/mouse" },
  { label: "Sideways Sam", path: "/sidewayssam" },
  { label: "Ultimate Tic-Tac-Toe", path: "/ultimatetictactoe" },
];

const TOOLS = [
  { label: "Countdown", path: "/countdown" },
  { label: "To-Do", path: "/todo" },
  { label: "Video Translator", path: "/videotranslator" },
  { label: "Video Rater", path: "/videorater" },
  { label: "Base Converter", path: "/baseconverter" },
];

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <>
      <nav onMouseLeave={() => setMenuOpen(false)}>
        <button
          className={` md:hidden text-white focus:outline-none`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Hamburger icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div
          className={`flex-row justify-center md:hidden ${menuOpen ? "flex flex-col" : "hidden space-x-2"} p-2 space-y-2 md:space-y-0 absolute md:static bg-sky-500 dark:bg-indigo-800 left-0 w-full md:w-auto  md:top-auto z-10 md:items-center`}
        >
          <button
            className={
              "bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 px-4 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
            }
          >
            <Link to="/" className={`${menuOpen ? "block w-full" : ""}`}>
              Home
            </Link>
          </button>
          <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 px-4 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
            <Link to="/games" className={`${menuOpen ? "block w-full" : ""}`}>
              Games
            </Link>
          </button>
          <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 px-4 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
            <Link to="/tools" className={`${menuOpen ? "block w-full" : ""}`}>
              Tools
            </Link>
          </button>

          <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
            <a
              href={chipmunk}
              className={`${menuOpen ? "block w-full" : ""}`}
              target="_blank"
            >
              Chipmunk
            </a>
          </button>
          <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
            <a
              href={`/${krish_resume}`}
              className={`${menuOpen ? "block w-full" : ""}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              My Resume
            </a>
          </button>
        </div>

        <div
          className={`flex-row justify-center hidden md:flex ${menuOpen ? "flex flex-col md:flex-row" : "hidden"} space-x-2 p-2 space-y-2 md:space-y-0 absolute md:static bg-cyan-500 dark:bg-blue-800 left-0 w-fit md:w-full  md:top-auto z-10 md:items-center`}
        >
          <Link to="/">
            <button
              className={
                "bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 px-4 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
              }
            >
              Home
            </button>
          </Link>

          {/* Games Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setGamesOpen(true)}
            onMouseLeave={() => setGamesOpen(false)}
          >
            <Link to="/games">
              <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700 flex items-center gap-1">
                Games
                <svg
                  className={`w-4 h-4 transition-transform ${
                    gamesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </Link>
            {gamesOpen && (
              <div className="absolute left-0 mt-0 w-48 bg-cyan-400 dark:bg-blue-900 rounded-md py-2 shadow-lg z-20">
                {GAMES.map((game) => (
                  <Link key={game.path} to={game.path}>
                    <button className="block w-full text-left px-4 py-2 hover:bg-cyan-600 dark:hover:bg-blue-800 hover:text-white dark:hover:text-black">
                      {game.label}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <Link to="/tools">
              <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700 flex items-center gap-1">
                Tools
                <svg
                  className={`w-4 h-4 transition-transform ${
                    toolsOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </Link>
            {toolsOpen && (
              <div className="absolute left-0 mt-0 w-48 bg-cyan-400 dark:bg-blue-900 rounded-md shadow-lg py-2 z-20">
                {TOOLS.map((tool) => (
                  <Link key={tool.path} to={tool.path}>
                    <button className="block w-full text-left px-4 py-2 hover:bg-cyan-600 dark:hover:bg-blue-800 hover:text-white dark:hover:text-black">
                      {tool.label}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href={chipmunk} target="_blank">
            <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
              Chipmunk
            </button>
          </a>
          <a href={pianowizards} target="_blank">
            <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
              Piano Wizards
            </button>
          </a>
          <a
            href={`/${krish_resume}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
              My Resume
            </button>
          </a>
        </div>
      </nav>
    </>
  );
};
