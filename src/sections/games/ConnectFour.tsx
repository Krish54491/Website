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

import { useState } from "react";

type Color = "yellow" | "red" | "";
const Tile = ({
  value,
  checkColumn,
}: {
  value: Color;
  checkColumn: () => void;
}) => {
  // TO-DO
  // have to later make it change color on being filled, but that can be done easily with value and css color changes

  return (
    <button
      className={`border-2  border-input  p-2 lg:p-8 text-2xl md:text-4xl rounded-full w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-center ${
        value ? (value == "red" ? "bg-red-700" : "bg-amber-400") : "bg-accent"
      }`}
      onClick={checkColumn} // basically place in column
    >
      {value ?? "⠀"}
    </button>
  );
};
const Column = ({ columnID }: { columnID: number }) => {
  const rows = 6; // amount of rows per column
  let col = [];
  for (let i = 0; i < rows; i++) {
    col.push(<Tile value="" checkColumn={() => {}} key={columnID + i} />);
  }
  return <div className="flex flex-col gap-1">{col}</div>;
};
export default function ConnectFour() {
  const [turn, setTurn] = useState("yellow"); // yellow goes first because I like it
  let board = [];
  const cols = 7;
  for (let i = 0; i < cols; i++) {
    board.push(<Column columnID={i} />);
  }
  function checkColumn() {}
  return (
    <div className="flex justify-center">
      <div className="mt-10 h-fit border-2 w-fit bg-primary/10">
        <div className="flex flex-row justify-center gap-1">{board}</div>
      </div>
    </div>
  );
}
