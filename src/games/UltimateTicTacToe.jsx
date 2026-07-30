import { useState } from "react";
import { Link } from "react-router-dom";

export const UltimateTicTacToe = () => {
  const [squares, setSquares] = useState(
    Array(9)
      .fill(0)
      .map(() => Array(9).fill(0)),
  );
  const [finalSquares, setFinalSquares] = useState(Array(9).fill(0));
  const [playingBoard, setPlayingBoard] = useState(10); // 10 means any board is allowed
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const winner = calculateWinner(finalSquares);
  const gameOver =
    (winner && winner !== "-") ||
    finalSquares.every((val) => val !== 0 && val !== undefined);
  let status;
  if (winner && winner != "-") {
    status = "Winner: " + winner;
  } else if (finalSquares.every((val) => val !== 0 && val !== undefined)) {
    status = "It's a Tie!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  function calculateWinner(squares) {
    if (squares === Array(9).fill(0)) {
      return null;
    }
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] != 0 &&
        squares[a] != "-" &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }
  function restartGame() {
    setCurrentMove(0);
    setFinalSquares(Array(9).fill(0));
    setSquares(
      Array(9)
        .fill(0)
        .map(() => Array(9).fill(0)),
    );
    setPlayingBoard(10);
  }
  const Square = ({ value, onSquareClick, active }) => {
    return (
      <button
        className={`border-2 dark:border-neutral-200 border-slate-900 p-2 lg:p-8 text-2xl md:text-4xl rounded-md md:w-[4rem] md:h-[4rem] lg:w-[5rem] lg:h-[5rem] text-center ${
          value === 0 && active ? "hover:animate-scale" : ""
        }`}
        onClick={onSquareClick}
      >
        {value === 0 ? "⠀" : value}
      </button>
    );
  };
  const MiniBoard = ({ boardIndex, disabled, active }) => {
    const handleClick = (i) => {
      if (disabled || !active) return;
      if (squares[boardIndex][i] || calculateWinner(squares[boardIndex]))
        return;
      let nextSquares = squares[boardIndex];
      nextSquares[i] = xIsNext ? "X" : "O";
      const nextBoard = squares;
      nextBoard[boardIndex] = nextSquares;
      setSquares(nextBoard);
      setCurrentMove(currentMove + 1);

      const miniWinner = calculateWinner(nextSquares);
      if (miniWinner) {
        setFinalSquares((prev) => {
          const updated = [...prev];
          updated[boardIndex] = miniWinner;
          return updated;
        });
      } else if (nextSquares.every((val) => val !== 0 && val !== undefined)) {
        setFinalSquares((prev) => {
          const updated = [...prev];
          updated[boardIndex] = "-";
          return updated;
        });
      }

      if (
        !calculateWinner(squares[i]) &&
        !squares[i].every((val) => val !== 0 && val !== undefined)
      ) {
        setPlayingBoard(i);
      } else {
        setPlayingBoard(10); // Any board allowed if next is won/full
      }
    };
    return (
      <div
        className={`grid grid-cols-3 grid-rows-3 gap-1 ${active ? "animate-pulse" : ""}`}
      >
        {squares[boardIndex].map((val, i) => (
          <Square
            key={i}
            value={val}
            active={active}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    );
  };

  // Renders the main 3x3 board of mini-boards
  return (
    <div className="flex flex-col items-center mt-2">
      <div className="flex flex-col lg:flex-row items-center mt-1">
        <div className="grid gap-4 grid-cols-3 grid-rows-3 px-3">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="">
                {calculateWinner(squares[i]) ? (
                  <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
                    <button
                      className="col-span-3 row-span-3 border-2 dark:border-neutral-200 border-slate-900 p-2 lg:p-8 text-9xl rounded-md w-full h-full flex items-center justify-center md:w-[12.5rem] md:h-[12.5rem] lg:w-[16rem] lg:h-[15.5rem]"
                      style={{ minHeight: 0, minWidth: 0 }}
                    >
                      {calculateWinner(squares[i])}
                    </button>
                  </div>
                ) : squares[i].every(
                    (val) => val !== 0 && val !== undefined,
                  ) ? (
                  <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
                    <button
                      className="col-span-3 row-span-3 border-2 dark:border-neutral-200 border-slate-900 p-2 lg:p-8 text-9xl rounded-md w-full h-full flex items-center justify-center md:w-[12.5rem] md:h-[12.5rem] lg:w-[16rem] lg:h-[15.5rem]"
                      style={{ minHeight: 0, minWidth: 0 }}
                    >
                      -
                    </button>
                  </div>
                ) : (
                  <MiniBoard
                    boardIndex={i}
                    disabled={gameOver}
                    active={
                      !gameOver &&
                      (playingBoard === 10 || playingBoard === i) &&
                      !calculateWinner(squares[i]) &&
                      !squares[i].every((val) => val !== 0 && val !== undefined)
                    }
                  />
                )}
              </div>
            ))}
        </div>
        <ol className="flex items-start justify-center flex-col m-3 ">
          {status}
          <button
            className={`bg-cyan-500 dark:bg-indigo-800 p-2 rounded-md my-1 ${
              !status.includes("Next player:")
                ? "animate-bounce"
                : "hover:animate-wiggle"
            }`}
            onClick={restartGame}
          >
            Restart
          </button>
          <Link to="/tictactoe" className="flex items-center justify-center">
            <button className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
              Normal Tic-Tac-Toe
            </button>
          </Link>
        </ol>
      </div>
    </div>
  );
};
