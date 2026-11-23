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
import { useState } from "react";

const rows = 7; // amount of rows per column
const cols = 6;

const Tile = ({
  value,
  placeInColumn,
}: {
  value: number;
  placeInColumn: () => void;
}) => {
  // TO-DO
  // have to later make it change color on being filled, but that can be done easily with value and css color changes

  return (
    <button
      className={`border-2  border-input  p-2 lg:p-8 text-2xl md:text-4xl rounded-full w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-center ${
        value
          ? value === 2
            ? "bg-red-700"
            : "bg-amber-400"
          : "bg-accent hover:animate-scale"
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
  const [tiles, setTiles] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(0)),
  ); // val = 0 means empty, 1 means yellow, 2 means red
  const checkColumn: (colID: number) => number = (colID: number) => {
    for (let i = tiles[colID].length; i >= 0; i--) {
      if (tiles[colID][i] === 0) {
        setTurn((prev) => {
          return prev === 0 ? 1 : 0;
        });
        return i; // returns first tile that is at the bottom
      }
    }
    return -1;
  };
  const placeInColumn = (colID: number) => {
    const lowestRow = checkColumn(colID);
    if (lowestRow === -1) {
      return; // don't place anything, no room
    }
    tiles[colID][lowestRow] = turn === 0 ? 1 : 2; // replace tile
  };
  return (
    <div className="flex justify-center">
      <div className="mt-10 h-fit border-2 w-fit bg-primary/10">
        <div className="flex flex-row justify-center gap-1">
          <Board tiles={tiles} placeInColumn={placeInColumn} />
        </div>
      </div>
    </div>
  );
}
