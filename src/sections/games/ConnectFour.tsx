// Connect four pretty simple
// Board have each tile be a circle put it in a square big board
// each column is it's own object this way the lowest tile can be independently tracked
/*
| O O O O |
| O 1 O O |
| O 1 O 1 |
actual connect four has 6 rows and 7 columns
*/
// this type of setup lets us find which is the highest row free in the column

// columns have data values of an Array of the tiles and a boolean filled so that players can't use that tile
// tiles have what color they are(this is also if their empty)
// top tile is 0, bottom is max length
import { useEffect, useState, type CSSProperties } from "react";
import { Confetti } from "../../components/Confetti.jsx";

const rows = 7; // amount of rows per column
const cols = 6;

const tileSize =
  "rounded-full w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0";
// notched rim, a ring of darker ridges around the edge like a real checker
const Ridges = ({ value }: { value: number }) => (
  <span
    className="pointer-events-none absolute inset-0 rounded-full"
    style={{
      background: `repeating-conic-gradient(${
        value === 2 ? "rgba(69, 10, 10, 0.55)" : "rgba(146, 64, 14, 0.55)"
      } 0deg 5deg, transparent 5deg 10deg)`,
      mask: "radial-gradient(circle, transparent 60%, black 62%)",
      WebkitMask: "radial-gradient(circle, transparent 60%, black 62%)",
    }}
  />
);

const Tile = ({
  value,
  row,
  ghost,
  turn,
  gameOver,
  clearing,
  winning,
  placeInColumn,
}: {
  value: number;
  row: number; // how far down the column, used for the drop distance
  ghost: boolean; // this is where the next disc lands
  turn: number;
  gameOver: boolean;
  clearing: boolean;
  winning: boolean; // part of the winning four
  placeInColumn: () => void;
}) => {
  let look;
  if (value) {
    // filled, don't use turn in here or every disc re-runs its drop each turn
    look = `border-4 ${
      value === 2 ? "bg-red-700" : "bg-amber-400"
    } ${
      winning
        ? "border-black dark:border-white"
        : value === 2
          ? "border-red-400"
          : "border-amber-600"
    } ${clearing ? "animate-fall-out" : "animate-drop"}`;
  } else if (ghost && !gameOver && !clearing) {
    // flickering ghost of the disc about to be placed, shows on column hover
    look = `bg-accent border-2 border-input ${
      turn === 0
        ? "group-hover:bg-amber-400 group-hover:border-amber-600"
        : "group-hover:bg-red-700 group-hover:border-red-400"
    } group-hover:animate-flicker`;
  } else {
    look = "bg-accent hover:animate-scale border-2 border-input";
  }
  return (
    <button
      className={`relative ${tileSize} ${look}`}
      style={{ "--drop-rows": row + 1 } as CSSProperties}
      onClick={placeInColumn} // basically place in column
    >
      {value ? <Ridges value={value} /> : null}
    </button>
  );
};
const Column = ({
  columnID,
  colTiles,
  turn,
  gameOver,
  clearing,
  winningTiles,
  placeInColumn,
}: {
  columnID: number;
  colTiles: number[];
  turn: number;
  gameOver: boolean;
  clearing: boolean;
  winningTiles: number[][];
  placeInColumn: (colID: number) => void;
}) => {
  const landing = colTiles.lastIndexOf(0); // lowest empty slot, -1 when full
  const showPreview = landing !== -1 && !gameOver && !clearing;
  return (
    <div className="group flex flex-col gap-1">
      {/* disc held above the column on hover */}
      <button
        aria-label={`Drop in column ${columnID + 1}`}
        className={`relative ${tileSize} border-4 invisible ${
          showPreview ? "group-hover:visible" : ""
        } ${
          turn === 0
            ? "bg-amber-400 border-amber-600"
            : "bg-red-700 border-red-400"
        }`}
        onClick={() => placeInColumn(columnID)}
      >
        <Ridges value={turn === 0 ? 1 : 2} />
      </button>
      {colTiles.map((val, i) => {
        return (
          <Tile
            value={val}
            key={i + "" + columnID}
            row={i}
            ghost={i === landing}
            turn={turn}
            gameOver={gameOver}
            clearing={clearing}
            winning={winningTiles.some(
              ([col, row]) => col === columnID && row === i,
            )}
            placeInColumn={() => placeInColumn(columnID)}
          />
        );
      })}
    </div>
  );
};
const Board = ({
  tiles,
  turn,
  gameOver,
  clearing,
  winningTiles,
  placeInColumn,
}: {
  tiles: number[][];
  turn: number;
  gameOver: boolean;
  clearing: boolean;
  winningTiles: number[][];
  placeInColumn: (colID: number) => void;
}) => {
  return (
    <>
      {tiles.map((colTiles, i) => {
        return (
          <Column
            key={i}
            colTiles={colTiles}
            columnID={i}
            turn={turn}
            gameOver={gameOver}
            clearing={clearing}
            winningTiles={winningTiles}
            placeInColumn={placeInColumn}
          />
        );
      })}
    </>
  );
};

export default function ConnectFour() {
  const [turn, setTurn] = useState(0); // yellow goes first because I like it yellow=0, red=1 for turn order only(just so it takes only one bit)
  const [gameOver, setGameOver] = useState(false); // game is autostarted for now
  const [colFull, setColFull] = useState(Array(cols).fill(false)); // array size of columns to track if they're full for faster processing
  const [tiles, setTiles] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(0)),
  ); // val = 0 means empty, 1 means yellow, 2 means red
  const [winner, setWinner] = useState(""); // "yellow", "red" or "tie" once the game ends
  const [winningTiles, setWinningTiles] = useState<number[][]>([]); // [col, row] of the winning four
  const [clearing, setClearing] = useState(false); // true while the discs fall out on restart
  const checkColumn: (colID: number) => number = (colID: number) => {
    if (colFull[colID]) {
      return -1;
    }
    for (let i = tiles[colID].length; i >= 0; i--) {
      if (tiles[colID][i] === 0) {
        setTurn((prev) => {
          return prev === 0 ? 1 : 0;
        });
        if (i === 0) {
          setColFull((prev) => {
            let newColFull = prev.slice();
            newColFull[colID] = true;
            return newColFull;
          });
        }
        return i; // returns first tile that is at the bottom
      }
    }
    setColFull((prev) => {
      let newColFull = prev.slice();
      newColFull[colID] = true;
      return newColFull;
    });
    return -1;
  };
  const placeInColumn = (colID: number) => {
    if (gameOver) return; // if the game is over what the hell are you placing
    const lowestRow = checkColumn(colID);
    if (lowestRow === -1) {
      return; // don't place anything, no room
    }
    setTiles((prev) => {
      let newTiles = prev.slice();
      newTiles[colID][lowestRow] = turn === 0 ? 1 : 2;
      return newTiles;
    }); // replace tile
  };
  useEffect(() => {
    if (gameOver) {
      return;
    }
    const winCheck = checkWinner();
    if (winCheck === "red") {
      // check who wins
      setGameOver(true);
      setWinner(winCheck);
    } else if (winCheck === "yellow") {
      setGameOver(true);
      setWinner(winCheck);
    } else if (winCheck === "tie") {
      // how tf
      setGameOver(true);
      setWinner(winCheck);
    }
  }, [gameOver, turn]);
  function checkWinner(): string {
    // function that ends game
    // win conditons for  4... bruh it's litterally the name
    // check diagonal, horizontial, vertical
    // check if all full columns are full for tie
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (tiles[i][j] === 0) {
          continue;
        }
        if (i < rows - 3) {
          if (
            tiles[i][j] === tiles[i + 1][j] &&
            tiles[i + 2][j] === tiles[i + 1][j] &&
            tiles[i + 2][j] === tiles[i + 3][j]
          ) {
            // checks all horizontial
            setWinningTiles([[i, j], [i + 1, j], [i + 2, j], [i + 3, j]]);
            return tiles[i][j] === 1 ? "yellow" : "red";
          }
        }
        if (j < cols - 3) {
          if (
            tiles[i][j + 1] === tiles[i][j] &&
            tiles[i][j + 2] === tiles[i][j + 1] &&
            tiles[i][j + 2] === tiles[i][j + 3]
          ) {
            // checks all vertical
            setWinningTiles([[i, j], [i, j + 1], [i, j + 2], [i, j + 3]]);
            return tiles[i][j] === 1 ? "yellow" : "red";
          }
        }
        if (i < rows - 3 && j < cols - 3) {
          if (
            tiles[i + 1][j + 1] === tiles[i][j] &&
            tiles[i + 2][j + 2] === tiles[i + 1][j + 1] &&
            tiles[i + 2][j + 2] === tiles[i + 3][j + 3]
          ) {
            // checks all up diagonal /
            setWinningTiles([
              [i, j],
              [i + 1, j + 1],
              [i + 2, j + 2],
              [i + 3, j + 3],
            ]);
            return tiles[i][j] === 1 ? "yellow" : "red";
          }
        }
        if (i >= 3 && j < cols - 3) {
          if (
            tiles[i - 1][j + 1] === tiles[i][j] &&
            tiles[i - 2][j + 2] === tiles[i - 1][j + 1] &&
            tiles[i - 2][j + 2] === tiles[i - 3][j + 3]
          ) {
            // checks all down diagonal /
            setWinningTiles([
              [i, j],
              [i - 1, j + 1],
              [i - 2, j + 2],
              [i - 3, j + 3],
            ]);
            return tiles[i][j] === 1 ? "yellow" : "red";
          }
        }
      }
    }
    // O(n^2)
    let counter = 0;
    colFull.forEach((check) => {
      if (check) counter++;
    });
    if (counter === colFull.length) {
      return "tie";
    }
    return "";
  }
  const restart = () => {
    if (clearing) return;
    setClearing(true); // discs fall out first, then the board resets
    setTimeout(() => {
      setTiles(Array.from({ length: rows }, () => Array(cols).fill(0)));
      setGameOver(false);
      setTurn(0);
      setColFull(Array(cols).fill(false));
      setWinner("");
      setWinningTiles([]);
      setClearing(false);
    }, 500);
  };
  let status;
  if (winner === "tie") {
    status = <span>It's a tie!</span>;
  } else if (winner) {
    status = (
      <span className={winner === "red" ? "text-red-700" : "text-amber-400"}>
        {winner === "red" ? "Red" : "Yellow"} wins!
      </span>
    );
  } else {
    status = (
      <span className={turn === 0 ? "text-amber-400" : "text-red-700"}>
        {turn === 0 ? "Yellow" : "Red"}'s turn
      </span>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center mt-10 gap-4">
      <div
        className={`h-fit border-2 w-fit bg-primary/10 p-1 overflow-hidden ${
          clearing ? "pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-row justify-center gap-1">
          <Board
            tiles={tiles}
            turn={turn}
            gameOver={gameOver}
            clearing={clearing}
            winningTiles={winningTiles}
            placeInColumn={placeInColumn}
          />
        </div>
      </div>
      <div className="flex flex-col items-center lg:items-start justify-center gap-2 m-3">
        <p className="text-2xl font-bold">{status}</p>
        <button
          onClick={restart}
          className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          Restart
        </button>
      </div>
      {(winner === "yellow" || winner === "red") && <Confetti />}
    </div>
  );
}
