import { useState, useEffect } from "react";

export const MouseGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeSurvived, setTimeSurvived] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [projectiles, setProjectiles] = useState([]); // array of projectiles
  const [highScore, setHighScore] = useState(0);
  const [check, setCheck] = useState(true);
  const [difficulty, setDifficulty] = useState(1); // amount of projectiles
  const [prevTime, setPrevTime] = useState(0);
  const [prevMinute, setPrevMinute] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [cheater, setCheater] = useState(
    localStorage.getItem("mouseGameCheated") === "true",
  ); // if you ever have cheated you will be shamed for it
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  if (localStorage.getItem("mouseGameHighScore") != null && check) {
    setHighScore(parseInt(localStorage.getItem("mouseGameHighScore")));
    setCheck(false);
  }
  //const [gameSize, setGameSize] = useState({ width: 96, height: 96 });
  //const [check, setCheck] = useState(true);
  // first we need a start button, when pushed begin the game
  const start = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setTimeSurvived(0);
      // put commands to set up game environment
      setDifficulty(1);
      setPrevTime(0);
      setPrevMinute(0);
      setSpeed(5);
      setPrevPosition({ x: 0, y: 0 });
      setProjectiles([]); // reset projectiles
    }
  };
  const endGame = (cheat) => {
    setGameStarted(false);
    if (cheat) {
      return;
    }
    if (timeSurvived > highScore) {
      setHighScore(timeSurvived);
      localStorage.setItem("mouseGameHighScore", timeSurvived.toString());
    }
  };
  const resetHighScore = () => {
    setHighScore(0);
    localStorage.setItem("mouseGameHighScore", "0");
  };
  const handleMouseMove = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    let timerInterval;
    if (!gameStarted) return;

    timerInterval = setInterval(() => {
      setTimeSurvived((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup interval on unmount
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    setProjectiles((prev) => {
      const newProjectiles = [...prev];
      while (newProjectiles.length < difficulty) {
        newProjectiles.push({
          x: 15,
          y: Math.random() * 343,
          xdirection: true,
          ydirection: true,
        });
      }
      return newProjectiles;
    });
    const moveInterval = setInterval(() => {
      setProjectiles((prev) => {
        return prev.map((p) => {
          if (p.x > 350) {
            p.xdirection = false;
          } else if (p.x < 15) {
            p.xdirection = true;
          }
          if (p.y > 343) {
            p.ydirection = false;
          } else if (p.y < 5) {
            p.ydirection = true;
          }
          return {
            ...p,
            x: p.x + (p.xdirection ? speed : -1 * speed),
            y: p.y + (p.ydirection ? speed : -1 * speed),
          }; // random vertical movement
        });
      });
    }, 30);

    return () => clearInterval(moveInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, difficulty]);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // scrapped idea to change game size based on time survived
    //if (minutes >= 1 && check) {
    //    setGameSize({ width: 128, height: 128 });
    //    setCheck(false);
    //}
    if (minutes > prevMinute && time != highScore) {
      setDifficulty(1);
      const newProjectiles = [];
      newProjectiles.push({
        x: 15,
        y: Math.random() * 343,
        xdirection: true,
        ydirection: true,
      });
      setProjectiles(newProjectiles);
      setPrevMinute(minutes);
      setPrevTime(Math.floor(time / 10));
      setPrevPosition({ x: position.x, y: position.y });
      setSpeed(speed + 2);
      if (position.x === prevPosition.x && position.y === prevPosition.y) {
        setTimeSurvived(0);
        setCheater(true);
        localStorage.setItem("mouseGameCheated", "true");
        endGame(true);
      }
    } else if (Math.floor(time / 10) > prevTime && time != highScore) {
      setDifficulty(difficulty + 1);
      setPrevTime(Math.floor(time / 10));
      setPrevPosition({ x: position.x, y: position.y });
      if (position.x === prevPosition.x && position.y === prevPosition.y) {
        setTimeSurvived(0);
        setCheater(true);
        localStorage.setItem("mouseGameCheated", "true");
        endGame(true);
      }
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  // after game starts we need to make a box that you lose if your mouse exits it

  // have projectiles try to hit mouse and if it hits end game

  // have restart button and potentially high score(score will be time survived)

  return (
    <>
      <div className="flex flex-col items-center justify-normal mt-4">
        <h1 className="text-4xl font-bold mb-4">Mouse Dodge</h1>
        <p className="text-xl mb-2 text-center">
          {cheater
            ? "Don't try to cheat my game..."
            : "Avoid the projectiles and survive as long as you can!"}
        </p>
        <p className="text-xl mb-2">High Score: {formatTime(highScore)}</p>
        <p className="text-lg mb-4">
          {gameStarted
            ? "Time Survived: " + formatTime(timeSurvived)
            : timeSurvived
              ? "Previous run: " + formatTime(timeSurvived)
              : "Click Start to begin!"}
        </p>
        <div
          className={`flex flex-col items-center justify-center ${gameStarted ? `w-96 h-96 border-4 dark:border-neutral-200 border-slate-900 lg relative` : ""}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => endGame(false)}
        >
          <button
            className={`${!gameStarted ? "mt-10 p-2 bg-green-500 dark:bg-green-600 rounded-md m-2" : "hidden"}`}
            onClick={start}
          >
            Start
          </button>
          {gameStarted &&
            projectiles.map((p, i) => (
              <div
                key={i}
                onMouseEnter={() => endGame(false)}
                style={{
                  position: "absolute",
                  left: p.x - 10,
                  top: p.y,
                  width: 30,
                  height: 30,
                  background: "red",
                  borderRadius: "50%",
                }}
              />
            ))}
        </div>
        <p>
          X: {position.x}, Y: {position.y}
        </p>
        <button
          className={"mt-2 p-2 bg-yellow-500 dark:bg-yellow-600 rounded-md m-2"}
          onClick={resetHighScore}
        >
          Reset High Score
        </button>
      </div>
    </>
  );
};
