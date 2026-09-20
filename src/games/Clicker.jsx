import { useState, useEffect } from "react";
import cookie from "../assets/cookie.png";

const startTime = Date.now();

export const Clicker = () => {
  const [clicked, setClicked] = useState(0);
  const [clickMult, setClickMult] = useState(1);
  const [grandmas, setGrandmas] = useState(0);
  const [time, setTime] = useState(0);
  const [grandBroke, setGrandBroke] = useState(false);
  const [multBroke, setMultBroke] = useState(false);
  const [prevTime, setPrevTime] = useState(0);
  //if(localStorage.getItem("clickerGame") && check){
  //    const prevData = JSON.parse(localStorage.getItem("clickerGame"))
  //    setClicked(prevData[0])
  //    setClickMult(prevData[1])
  //    setGrandmas(prevData[2])
  //    setCheck(false)
  //}
  const increaseClicked = () => {
    const arr = [];
    arr.push(clicked);
    arr.push(clickMult);
    arr.push(grandmas);
    setClicked(clicked + clickMult);
    //localStorage.setItem("clickerGame", arr)
  };
  const increaseClickMult = () => {
    if (clicked >= 100 * clickMult) {
      setClicked(clicked - 100 * clickMult);
      setClickMult(clickMult + 0.5);
      setMultBroke(false);
    } else {
      setMultBroke(true);
    }
  };
  const increaseGrandma = () => {
    if (clicked >= 10 * grandmas) {
      setClicked(clicked - 10 * grandmas);
      setGrandmas(grandmas + 1);
      setGrandBroke(false);
    } else setGrandBroke(true);
  };
  useEffect(() => {
    let timerInterval;
    timerInterval = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup interval on unmount
  });
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // scrapped idea to change game size based on time survived
    //if (minutes >= 1 && check) {
    //    setGameSize({ width: 128, height: 128 });
    //    setCheck(false);
    //}

    if (Math.floor(time / 10) > prevTime) {
      setClicked(clicked + grandmas);
      setPrevTime(Math.floor(time / 10));
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mt-4">
          Clicker Game made in 75 minutes
        </h1>
        <h2 className="text-2xl text-center mt-2">
          Time Played: {formatTime(time)}
        </h2>
        <h2 className="text-2xl text-center mt-2">Times Clicked: {clicked}</h2>
        <img
          className="w-96 h-96"
          src={cookie}
          alt="Cookie!"
          onClick={increaseClicked}
        ></img>
      </div>
      <div className="flex flex-row items-end justify-center">
        <button
          className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
          onClick={increaseGrandma}
        >
          Grandma(clicks for you every 5 seconds): {grandmas}
        </button>
        <button
          className="bg-cyan-500 dark:bg-blue-800 p-2 rounded-md m-1 hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
          onClick={increaseClickMult}
        >
          Click Multiplier: {clickMult}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center text-red-600">
        {grandBroke ? <p>Can&apos;t afford a Grandma</p> : ""}
        {multBroke ? <p>Can&apos;t afford a Multiplier</p> : ""}
      </div>
    </>
  );
};
