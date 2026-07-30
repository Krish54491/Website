// components:

import { TicTacToe } from "./games/TicTacToe.jsx";
import { Countdown } from "./tools/Countdown.jsx";
import { MouseGame } from "./games/MouseGame.jsx";
import { Clicker } from "./games/Clicker.jsx";
import { useState, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { Nav } from "./Nav.jsx";
import { ToDoList } from "./tools/TodoList.jsx";
import { SidewaysSam } from "./games/SidewaysSam.jsx";
import { UltimateTicTacToe } from "./games/UltimateTicTacToe.jsx";
import { Pokedex } from "./games/Pokedex.jsx";
import { VideoTranslator } from "./tools/VideoTranslator.jsx";
import { VideoRater } from "./tools/VideoRater.jsx";
import { BaseConverter } from "./tools/BetterBaseConverter.tsx";
import Cards from "./components/Cards.tsx";
import Ampharos from "./assets/Ampharos.png";
import Comments from "./Comments.jsx";

function PokemonImage({ pokemonId, getPokemonPic }) {
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    let isMounted = true;
    getPokemonPic(pokemonId).then((url) => {
      if (isMounted) setImgUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [pokemonId, getPokemonPic]);

  if (!imgUrl) return <div>Loading...</div>;

  return <img src={imgUrl} alt="Pokemon" />;
}
const games = [
  {
    id: "ultimatetictactoe",
    name: "Ultimate Tic Tac Toe",
    description:
      "A more complex version of tic tac toe where you have to win 3 boards to win the game.",
    path: "/ultimatetictactoe",
    thumbnail: () =>
      import("./assets/games/thumbnails/Ultimate Tic-Tac-Toe.png"),
    video: () => import("./assets/games/videos/ultimate Tic-Tac-Toe.mp4"),
    mobile: true,
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "The classic tic tac toe game. Get three in a row to win!",
    path: "/tictactoe",
    thumbnail: () => import("./assets/games/thumbnails/Tic-Tac-Toe.png"),
    video: () => import("./assets/games/videos/tic-tac-toe.mp4"),
    mobile: true,
  },
  {
    id: "mouse",
    name: "Mouse Game",
    description: "Control your mouse and try to survive the projectiles!",
    path: "/mouse",
    thumbnail: () => import("./assets/games/thumbnails/Mouse Game.png"),
    video: () => import("./assets/games/videos/mouse-game.mp4"),
    mobile: false,
  },
  {
    id: "sidewayssam",
    name: "Sideways Sam",
    description: "Help Sam dodge rocks and avoid a concussion!",
    path: "/sidewayssam",
    thumbnail: () => import("./assets/games/thumbnails/Sideways Sam.png"),
    video: () => import("./assets/games/videos/sideways-sam.mp4"),
    mobile: true,
  },
];
const tools = [
  {
    id: "countdown",
    name: "Countdown Timer",
    description: "A simple countdown timer for your needs.",
    path: "/countdown",
    thumbnail: () => import("./assets/tools/thumbnails/Countdown.png"),
    video: () => import("./assets/tools/videos/countdown.mp4"),
    mobile: true,
  },
  {
    id: "todo",
    name: "To-Do List",
    description: "A simple to-do list for your needs.",
    path: "/todo",
    thumbnail: () => import("./assets/tools/thumbnails/ToDoList.png"),
    video: () => import("./assets/tools/videos/todo.mp4"),
    mobile: true,
  },
  {
    id: "videotranslator",
    name: "Video Translator",
    description: "Translate videos with ease.",
    path: "/videotranslator",
    thumbnail: () => import("./assets/tools/thumbnails/VideoTranslator.png"),
    video: () => import("./assets/tools/videos/videotranslator.mp4"),
    mobile: true,
  },
  {
    id: "videorater",
    name: "Video Rater",
    description: "Rate and review videos with ease.",
    path: "/videorater",
    thumbnail: () => import("./assets/tools/thumbnails/VideoRater.png"),
    video: () => import("./assets/tools/videos/videorater.mp4"),
    mobile: true,
  },
  {
    id: "baseconverter",
    name: "Base Converter",
    description:
      "Convert between different numberical bases(e.g binary, decimal, hexadecimal).",
    path: "/baseconverter",
    thumbnail: () => import("./assets/tools/thumbnails/BaseConverter.png"),
    video: () => import("./assets/tools/videos/baseconverter.mp4"),
    mobile: true,
  },
];
function App() {
  const [pokedexCompletion, setPokedexCompletion] = useState(
    Array(1026).fill(0),
  );
  const [pic, setPic] = useState("./Krish544 Icon.png");
  const [pokemonName, setPokemonName] = useState("Krish544 Icon");
  const [pokemonFound, setPokemonFound] = useState(1);
  const [pokeCheck, setPokeCheck] = useState(true);
  if (localStorage.getItem("pokedexCompletion") != null && pokeCheck) {
    setPokedexCompletion(JSON.parse(localStorage.getItem("pokedexCompletion")));
    setPokemonFound(
      pokedexCompletion.reduce(
        (amount, val) => (val === 1 || val === 2 ? amount + 1 : amount),
        0,
      ),
    );
    setPokeCheck(false);
  }
  if (pokedexCompletion[0] === 0) {
    pokedexCompletion[0] = 1;
  }
  const getPokemonPic = async (id) => {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await pokemonRes.json();
    const shinypic = pokemonData.sprites.front_shiny;
    return shinypic;
  };
  const changePic = async () => {
    const speciesRes = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=0",
    );
    const speciesData = await speciesRes.json();
    const total = speciesData.count;
    const randomId = Math.floor(Math.random() * (total + 1));
    // this is a hot fix because the pokedex orginally could not hold 1026 pokemon and I want to keep the pokedex completion of previous users
    if (pokedexCompletion.length < 1026) {
      pokedexCompletion.push(0);
      pokedexCompletion[0] = 1;
    }

    if (pokeCheck) {
      setPokedexCompletion(Array(total + 1).fill(0));
      pokedexCompletion[0] = 1;
      setPokeCheck(false);
    }
    if (randomId === 0) {
      if (Math.floor(Math.random() * 2) === 0) {
        setPic("./Krish544 Icon.png");
      } else {
        setPic(Ampharos);
      }
      return;
    }
    if (pokedexCompletion[randomId] === 0) {
      pokedexCompletion[randomId] = 1;
    }
    const pokemonRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`,
    );
    const pokemon = await pokemonRes.json();
    const shinyChance = Math.floor(Math.random() * 4096 + 1);
    if (shinyChance < 10 && pokemonFound === 1026) {
      const shinySpriteUrl = pokemon.sprites.front_shiny;
      setPic(shinySpriteUrl);
      console.log("Shiny!");
      pokedexCompletion[randomId] = 2;
    } else if (shinyChance === 1) {
      const shinySpriteUrl = pokemon.sprites.front_shiny;
      setPic(shinySpriteUrl);
      console.log("Shiny!");
      pokedexCompletion[randomId] = 2;
    } else {
      const spriteUrl = pokemon.sprites.front_default;
      setPic(spriteUrl);
    }
    localStorage.setItem(
      "pokedexCompletion",
      JSON.stringify(pokedexCompletion),
    );
    setPokemonName(pokemon.name);
    setPokemonFound(
      pokedexCompletion.reduce(
        (amount, val) => (val === 1 || val === 2 ? amount + 1 : amount),
        0,
      ),
    );
  };
  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex flex-col relative items-center justify-center mb-12 lg:mt-14">
                <img
                  src={`${pic}`}
                  onClick={changePic}
                  alt={pokemonName}
                  className="lg:w-1/5 w-4/5 hover:animate-smallspin"
                ></img>
                <h3 className="text-2xl">
                  {pokemonFound === 0
                    ? "Pokedex Data Loaded"
                    : `Amount of Pokemon Found: ${pokemonFound}`}
                </h3>
                <h2 className="text-3xl">Krish Bharal&apos;s Portfolio</h2>
              </div>
              <div className="hidden lg:flex flex-row flex-wrap items-center justify-center space-x-0">
                {pokedexCompletion ? (
                  pokedexCompletion.map((item, idx) =>
                    item === 2 ? (
                      <PokemonImage
                        key={idx}
                        pokemonId={idx}
                        getPokemonPic={getPokemonPic}
                      />
                    ) : null,
                  )
                ) : (
                  <div>No data</div>
                )}
              </div>
            </>
          }
        />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/countdown" element={<Countdown />} />
        <Route path="/todo" element={<ToDoList />} />
        <Route path="/mouse" element={<MouseGame />} />
        <Route path="/clicker" element={<Clicker />} />
        <Route path="/ultimatetictactoe" element={<UltimateTicTacToe />} />
        <Route path="/sidewayssam" element={<SidewaysSam />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/videotranslator" element={<VideoTranslator />} />
        <Route path="/videorater" element={<VideoRater />} />
        <Route
          path="/games"
          element={<Cards items={games} listName="Games" />}
        />
        <Route
          path="/tools"
          element={<Cards items={tools} listName="Tools" />}
        />
        <Route path="/baseconverter" element={<BaseConverter />} />
      </Routes>
      <Comments />
      <Routes>
        <Route
          path="/*"
          element={
            <div className="flex flex-row items-center justify-center space-x-5 my-4">
              <a
                href="https://github.com/Krish54491"
                aria-label="GitHub"
                className="hover:opacity-80"
                target="_blank"
              >
                <svg
                  width="32"
                  height="32"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/krish-bharal-389105296/"
                aria-label="LinkedIn"
                className="hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="32"
                  height="32"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                </svg>
              </a>
              {Math.floor(Math.random() * 10) == 0 ? (
                <Link
                  to="/clicker"
                  aria-label="Cookie"
                  className="hover:opacity-80"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.94 13.06a1 1 0 0 0-1.13-.21 1 1 0 0 1-1.31-1.31 1 1 0 0 0-.21-1.13l-1.42-1.42a1 1 0 0 0-1.13-.21 1 1 0 0 1-1.31-1.31 1 1 0 0 0-.21-1.13l-1.42-1.42a1 1 0 0 0-1.13-.21 1 1 0 0 1-1.31-1.31 1 1 0 0 0-.21-1.13A9 9 0 1 0 21.94 13.06ZM7 14a1 1 0 1 1 1 1 1 1 0 0 1-1-1Zm2 4a1 1 0 1 1 1 1 1 1 0 0 1-1-1Zm2-8a1 1 0 1 1 1 1 1 1 0 0 1-1-1Zm4 6a1 1 0 1 1 1 1 1 1 0 0 1-1-1Z" />
                  </svg>
                </Link>
              ) : (
                <></>
              )}
              <Link
                to="/pokedex"
                aria-label="Pokedex"
                className="hover:opacity-80"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  x="0px"
                  y="0px"
                  width="48px"
                  height="48px"
                  viewBox="0 0 48 48"
                  enableBackground="new 0 0 48 48"
                  xmlSpace="preserve"
                >
                  <path
                    fill="#37474F"
                    d="M33,27l6,0.001c3.314,0,6,2.686,6,5.999l0,0c0,3.313-2.686,6-6,6h-6V27z"
                  />
                  <g>
                    <circle fill="#546E7A" cx="39" cy="33" r="4" />
                    <path
                      fill="#546E7A"
                      d="M11,25.001c-4.418,0-8,3.582-8,8l0,0c0,4.419,3.582,8,8,8V25.001z"
                    />
                  </g>
                  <rect x="13" y="23" fill="#DD2C00" width="19" height="2" />
                  <g>
                    <path
                      fill="#FF3D00"
                      d="M11,25.001V41c0,0,17.334,0,20,0c3,0,3-3,3-3V25.001H11z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M31,7c-3,0-14,0-17,0s-3,3-3,3v13h23V10C34,10,34,7,31,7z"
                    />
                  </g>
                  <g>
                    <path
                      fill="#263238"
                      d="M23,28H10.976c-2.717,0-4.919,2.283-4.919,5l0,0c0,2.717,2.202,5,4.919,5H23V28z"
                    />
                    <path
                      fill="#263238"
                      d="M29,19c0,0.553-0.447,1-1,1H15c-0.553,0-1-0.447-1-1v-8c0-0.553,0.447-1,1-1h13c0.553,0,1,0.447,1,1V19z"
                    />
                  </g>
                  <g>
                    <path
                      fill="#90A4AE"
                      d="M31,38c0,0.552-0.447,1-1,1H18c-0.553,0-1-0.448-1-1V28c0-0.552,0.447-1,1-1h12c0.553,0,1,0.448,1,1V38z"
                    />
                    <path
                      fill="#90A4AE"
                      d="M31,20c0,0.552-0.447,1-1,1H18c-0.553,0-1-0.448-1-1V10c0-0.552,0.447-1,1-1h12c0.553,0,1,0.448,1,1V20z"
                    />
                  </g>
                  <g>
                    <rect x="19" y="11" fill="#BBDEFB" width="10" height="8" />
                    <rect x="19" y="29" fill="#BBDEFB" width="10" height="8" />
                  </g>
                  <g>
                    <rect x="11" y="30" fill="#ECEFF1" width="2" height="6" />
                    <rect x="9" y="32" fill="#ECEFF1" width="6" height="2" />
                  </g>
                  <g>
                    <circle fill="#AEEA00" cx="39" cy="33" r="2" />
                    <path
                      fill="#AEEA00"
                      d="M3,32.994C3,32.996,3,32.998,3,33c0,0.302,0.022,0.597,0.052,0.891C3.057,33.928,3.064,33.963,3.068,34H4   c0.553,0,1-0.448,1-1s-0.447-1-1-1H3.069c-0.005,0.038-0.013,0.075-0.018,0.113C3.023,32.404,3.001,32.695,3,32.994z"
                    />
                  </g>
                </svg>
              </Link>
            </div>
          }
        />
        <Route path="*" element={<></>} />
      </Routes>
    </>
  );
}

export default App;
