import { useState, useEffect } from "react";
import { Confetti } from "../components/Confetti.jsx";

export const Countdown = () => {
  const [initial, setInitial] = useState({
    minutes: 1,
    seconds: 0,
  });
  const [minutes, setMinutes] = useState(initial.minutes);
  const [seconds, setSeconds] = useState(initial.seconds);
  const [endPoint, setEndPoint] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const updateCountdown = () => {
    const timeLeft = new Date(endPoint.getTime() - new Date().getTime());
    if (timeLeft <= 0) {
      setMinutes(0);
      setSeconds(0);
      setTimerActive(false);
      return;
    }
    setMinutes(timeLeft.getMinutes());
    setSeconds(timeLeft.getSeconds());
  };

  useEffect(() => {
    let timerInterval;
    if (!timerActive || !endPoint) return;

    if (timerActive) {
      timerInterval = setInterval(() => {
        updateCountdown();
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval); // Cleanup interval on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, endPoint]);

  const reset = () => {
    setTimerActive(false);
    setMinutes(initial.seconds || initial.minutes ? initial.minutes : 1);
    setSeconds(initial.seconds);
  };

  const inputChange = (e) => {
    const val = e.currentTarget.value;
    if (!val.includes(":")) return;
    const arr = val.split(":").map((v) => Math.min(59, parseInt(v)));
    if (!arr[0] && arr[0] !== 0) {
      arr[0] = 0;
    }
    setInitial({ minutes: arr[0], seconds: arr[1] });
    setMinutes(arr[0]);
    setSeconds(arr[1]);
  };

  const isConfettiTime = seconds === 0 && minutes === 0 && !timerActive;
  const startTimer = () => {
    if (isConfettiTime) {
      reset();
      setEndPoint(
        new Date(
          new Date().getTime() +
            initial.minutes * 60 * 1000 +
            (initial.seconds + 1) * 1000,
        ),
      );
      setTimerActive(true);
      return;
    }

    if (!timerActive) {
      setEndPoint(
        new Date(
          new Date().getTime() + minutes * 60 * 1000 + (seconds + 1) * 1000,
        ),
      );
      setTimerActive(true);
    }
  };
  return (
    <>
      {isConfettiTime && <Confetti />}
      <div className="flex flex-col justify-center items-center">
        <input
          type="text"
          disabled={timerActive}
          value={
            isConfettiTime
              ? "Congrats!"
              : minutes + ":" + (seconds < 10 ? `0${seconds}` : seconds)
          }
          onChange={inputChange}
          className={`text-5xl lg:text-9xl m-5 text-center bg-inherit w-fit`}
        ></input>
        <div className="flex flex-row m-2">
          {timerActive ? (
            <button
              className="p-2 bg-red-500 dark:bg-red-600 rounded-md m-2"
              onClick={() => setTimerActive(false)}
            >
              Stop
            </button>
          ) : (
            <button
              className="p-2 bg-green-500 dark:bg-green-600 rounded-md m-2"
              onClick={() => startTimer()}
            >
              Start
            </button>
          )}
          <button
            className="p-2 bg-yellow-500 dark:bg-yellow-600 rounded-md m-2"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};
