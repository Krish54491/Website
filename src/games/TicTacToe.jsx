import { useState } from "react";
import { Link } from "react-router-dom";

const Square = ({ value, onSquareClick }) => {
  return (
    <button
      className={`border-2 dark:border-neutral-200 border-slate-900 p-2 lg:p-20 text-8xl rounded-md h-24 w-24 sm:h-52 sm:w-52 md:h-60 md:w-60 lg:w-[16.25rem] lg:h-[16.25rem] ${
        value ? "" : "hover:animate-scale"
      }`}
      onClick={onSquareClick}
    >
      {value ?? "⠀"}
    </button>
  );
};
const Board = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (i) => {
    const nextSquares = squares.slice();
    if (!squares[i] && !calculateWinner(squares)) {
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
    }
  };

  return (
    <>
      <div>
        <div className="grid gap-4 grid-cols-3 grid-rows-3 px-3">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </>
  );
};
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export const TicTacToe = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
    //setHistory(history.slice(0, nextMove + 1)); so it doesn't remove history until you make a move
  };

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (currentMove == 9) {
    status = "It's a Tie!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const moves = history.map((squares, move) => {
    if (move > 0) {
      return (
        <li key={move}>
          <button
            onClick={() => jumpTo(move)}
            className="bg-cyan-500 dark:bg-indigo-800 p-2 rounded-md my-1"
          >
            Go to move # {move}
          </button>
        </li>
      );
    }
    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={`bg-cyan-500 dark:bg-indigo-800 p-2 rounded-md my-1 ${
            !status.includes("Next player:")
              ? "animate-bounce"
              : "hover:animate-wiggle"
          }`}
        >
          Go to game start
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center mt-2 items-center">
        <div className="flex flex-row">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <ol className="flex items-start justify-center flex-col m-3 ">
          {status}
          {moves}
          <Link
            to="/ultimatetictactoe"
            className="flex items-center justify-center"
          >
            <button className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
              Ultimate Tic-Tac-Toe
            </button>
          </Link>
        </ol>
      </div>
    </>
  );
};
