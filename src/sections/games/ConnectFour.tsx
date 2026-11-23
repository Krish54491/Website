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
import { useEffect, useState } from "react";

const rows = 7; // amount of rows per column
const cols = 6;

const Tile = ({
  value,
  placeInColumn,
}: {
  value: number;
  placeInColumn: () => void;
}) => {
  return (
    <button
      className={`p-2 lg:p-8 text-2xl md:text-4xl rounded-full w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-center ${
        value
          ? value === 2
            ? "bg-red-700 border-red-400 border-4"
            : "bg-amber-400 border-amber-600 border-4"
          : "bg-accent hover:animate-scale border-2 border-input"
      }`}
      onClick={placeInColumn} // basically place in column
    ></button>
  );
};
const Column = ({
  columnID,
  colTiles,
  placeInColumn,
}: {
  columnID: number;
  colTiles: number[];
  placeInColumn: (colID: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      {colTiles.map((val, i) => {
        return (
          <Tile
            value={val}
            key={i + "" + columnID}
            placeInColumn={() => placeInColumn(columnID)}
          />
        );
      })}
    </div>
  );
};
const Board = ({
  tiles,
  placeInColumn,
}: {
  tiles: number[][];
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
    } else if (winCheck === "yellow") {
      setGameOver(true);
    } else if (winCheck === "tie") {
      // how tf
      setGameOver(true);
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
  return (
    <div className="flex justify-center">
      <div className="mt-10 h-fit border-2 w-fit bg-primary/10 p-1">
        <div className="flex flex-row justify-center gap-1">
          <Board tiles={tiles} placeInColumn={placeInColumn} />
        </div>
      </div>
    </div>
  );
}
// TO-DO
// making it pretty:
/* making it pretty entails adding an animation for when it gets placed(drops down into slot), 
adding an indictator of where you're placing(on hover shows where you're placing),
maybe adding texture to border of discs(like ridges),
animation for clearing board,
use confetti when announcing winner(premade use that)
*/
// adding restart button
/* clears board 
setGameOver(false)
setTurn(0)
setColFull empty again
*/
// showing who won: just make a const useState and display on completion
// show who's turn it is(text color should be the color of the disc playing)
// this is all grunt work
