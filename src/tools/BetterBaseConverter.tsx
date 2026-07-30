import { useState } from "react";
const map: Map<number, string> = new Map([
  [0, "0"],
  [1, "1"],
  [2, "2"],
  [3, "3"],
  [4, "4"],
  [5, "5"],
  [6, "6"],
  [7, "7"],
  [8, "8"],
  [9, "9"],
  [10, "A"],
  [11, "B"],
  [12, "C"],
  [13, "D"],
  [14, "E"],
  [15, "F"],
  [16, "G"],
  [17, "H"],
  [18, "I"],
  [19, "J"],
  [20, "K"],
  [21, "L"],
  [22, "M"],
  [23, "N"],
  [24, "O"],
  [25, "P"],
  [26, "Q"],
  [27, "R"],
  [28, "S"],
  [29, "T"],
  [30, "U"],
  [31, "V"],
  [32, "W"],
  [33, "X"],
  [34, "Y"],
  [35, "Z"],
  [36, "a"],
  [37, "b"],
  [38, "c"],
  [39, "d"],
  [40, "e"],
  [41, "f"],
  [42, "g"],
  [43, "h"],
  [44, "i"],
  [45, "j"],
  [46, "k"],
  [47, "l"],
  [48, "m"],
  [49, "n"],
  [50, "o"],
  [51, "p"],
  [52, "q"],
  [53, "r"],
  [54, "s"],
  [55, "t"],
  [56, "u"],
  [57, "v"],
  [58, "w"],
  [59, "x"],
  [60, "y"],
  [61, "z"],
  [62, "Α"],
  [63, "Β"],
  [64, "Γ"],
  [65, "Δ"],
  [66, "Ε"],
  [67, "Ζ"],
  [68, "Η"],
  [69, "Θ"],
  [70, "Ι"],
  [71, "Κ"],
  [72, "Λ"],
  [73, "Μ"],
  [74, "Ν"],
  [75, "Ξ"],
  [76, "Ο"],
  [77, "Π"],
  [78, "Ρ"],
  [79, "Σ"],
  [80, "Τ"],
  [81, "Υ"],
  [82, "Φ"],
  [83, "Χ"],
  [84, "Ψ"],
  [85, "Ω"],
  [86, "α"],
  [87, "β"],
  [88, "γ"],
  [89, "δ"],
  [90, "ε"],
  [91, "ζ"],
  [92, "η"],
  [93, "θ"],
  [94, "ι"],
  [95, "κ"],
  [96, "λ"],
  [97, "μ"],
  [98, "ν"],
  [99, "ξ"],
  [100, "ο"],
  [101, "π"],
  [102, "ρ"],
  [103, "ς"],
  [104, "τ"],
  [105, "υ"],
  [106, "φ"],
  [107, "χ"],
  [108, "ψ"],
  [109, "ω"],
]);
const reverseMap: Map<string, number> = new Map(
  [...map.entries()].map(([key, value]) => [value, key]),
);
const spacing = 5;
const baseOptions = Array.from({ length: 109 }, (_, i) => i + 2);
export function BaseConverter() {
  const [baseInput, setBaseInput] = useState<string[]>(["10", "2"]);
  const [numInput, setNumInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  function baseToDecimal(num: string, base: number): number {
    if (base < 2 || base > 110) {
      return NaN; // planning to make base input dropdown with 2-110 as options, so this should never happen
    }
    if (num.length === 0) {
      return 0;
    }
    let result: number = 0;
    for (let i = 0; i < num.length; i++) {
      let digit: string = num[i];
      let digitValue: number =
        reverseMap.get(digit) || reverseMap.get(digit) === 0
          ? reverseMap.get(digit)!
          : NaN;
      if (digitValue >= base || isNaN(digitValue)) {
        return NaN; // Invalid digit for the given base
      }
      result += digitValue * Math.pow(base, num.length - 1 - i);
    }
    return result;
  }
  function decimalToBase(num: number, base: number): string {
    if (base < 2 || base > 110) {
      return "Invalid base"; // planning to make base input dropdown with 2-110 as options, so this should never happen
    }
    // max is 110 for now
    let result: string = "";
    let digits: number[] = [];
    while (num) {
      digits.push(num % base);
      num = Math.floor(num / base);
    }
    // convert digits
    for (let i = digits.length - 1; i >= 0; i--) {
      result += map.get(digits[i]) || "";
    }
    return result;
  }
  // plan to add 2's complement
  function twosComplement(num: string): string {
    // takes in string of binary number and will have it returns 2's complement alongside convertion to whatever base the user wants
    // this function is only called if the user has selected base 2 as a base(input or output)
    let result = num
      .split("")
      .map((digit) => (digit === "0" ? "1" : "0"))
      .join("");
    for (let i = num.length - 1; i >= 0; i--) {
      if (num[i] !== "0" && num[i] !== "1") {
        return "Invalid input";
      }
      if (result[i] === "0") {
        result = result.substring(0, i) + "1" + result.substring(i + 1);
        break;
      } else {
        result = result.substring(0, i) + "0" + result.substring(i + 1);
      }
    }
    return "1" + result;
  }
  const numOnLeave = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target?.value ?? "";
    if (val === "") {
      setResult("");
      setNumInput("");
      return;
    }
    setNumInput(val);
    setResult(convert(val, baseInput[0], baseInput[1]));
    setShowResult(true);
  };

  function convert(num: string, base1: string, base2: string): string {
    if (base1 === "" || base2 === "" || num === "") {
      return "";
    }
    if (isNaN(parseInt(base1)) || isNaN(parseInt(base2))) {
      return "Invalid input";
    }
    const decimalValue = baseToDecimal(num, parseInt(base1));
    const ans = decimalToBase(decimalValue, parseInt(base2));
    if (ans === "Invalid base" || isNaN(decimalValue)) {
      return "Invalid input";
    }
    return ans;
  }
  /*
  1. Convert the input number to decimal
  2. Convert the decimal number to the desired base
  3. Display the result
   Bases supported: 2-110
  */
  return (
    <>
      <div className="text-center my-2">
        <h2 className="text-2xl font-bold my-2">Base Converter</h2>
        <p className="">
          Convert numbers between any base, click out of the input field to see
          the result
        </p>
      </div>
      <div className="flex flex-col text-center">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl font-bold my-2">Number:</h3>
          <input
            type="text"
            value={numInput}
            onBlur={numOnLeave}
            onChange={(e) => {
              setNumInput(e.target?.value ?? "");
              setShowResult(false);
            }}
            className="bg-inherit m-2 rounded-md border-2 text-3xl w-full md:w-1/2 text-center border-black dark:border-white border-spacing-2"
          ></input>
        </div>
        <h3 className="text-2xl font-bold my-2">Base:</h3>
        <div className="flex flex-row justify-center items-center">
          <select
            value={baseInput[0]}
            onChange={(e) => {
              const val = e.target?.value ?? "10";
              setBaseInput([val, baseInput[1]]);
              setResult(convert(numInput, val, baseInput[1]));
              setShowResult(true);
            }}
            className="bg-neutral-200 dark:bg-slate-900 ml-2 rounded-md border-2 text-3xl border-black dark:border-white border-spacing-2"
          >
            {baseOptions.map((n) => (
              <option
                key={n}
                value={String(n)}
                className="bg-neutral-200 dark:bg-slate-900 text-slate-900 dark:text-neutral-200 text-sm md:text-base"
              >
                {n}
              </option>
            ))}
            {Array.from({ length: spacing }, (_, i) => (
              <option key={`pad-${i}`} value="" disabled>
                &nbsp;
              </option>
            ))}
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="#000000"
            version="1.1"
            id="Capa_1"
            className="w-8 h-8 m-2 dark:fill-white fill-black"
            viewBox="0 0 340.034 340.034"
            xmlSpace="preserve"
          >
            <g>
              <g>
                <polygon points="222.814,52.783 200.902,74.686 280.748,154.528 0,154.528 0,185.513 280.748,185.513 200.902,265.353     222.814,287.252 340.034,170.023   " />
              </g>
            </g>
          </svg>
          <select
            value={baseInput[1]}
            onChange={(e) => {
              const val = e.target?.value ?? "2";
              setBaseInput([baseInput[0], val]);
              setResult(convert(numInput, baseInput[0], val));
              setShowResult(true);
            }}
            className="bg-neutral-200 dark:bg-slate-900 rounded-md border-2 text-3xl border-black dark:border-white border-spacing-2"
          >
            {baseOptions.map((n) => (
              <option
                key={n}
                value={String(n)}
                className="bg-neutral-200 dark:bg-slate-900 text-slate-900 dark:text-neutral-200 text-sm md:text-base"
              >
                {n}
              </option>
            ))}
            {Array.from({ length: spacing }, (_, i) => (
              <option key={`pad-${i}`} value="" disabled>
                &nbsp;
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col justify-center items-center">
          <button
            className="mt-2 bg-inherit"
            onClick={() => {
              setBaseInput([baseInput[1], baseInput[0]]);
              setResult(convert(numInput, baseInput[1], baseInput[0]));
              setShowResult(true);
            }}
          >
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
              className="w-8 h-8 m-2 dark:fill-white fill-black"
            >
              {" "}
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                {" "}
                <path d="M1544 4165 c-561 -431 -659 -510 -662 -533 -1 -15 1 -32 5 -38 8 -11 1256 -972 1299 -1001 30 -19 68 -6 79 26 4 13 -39 132 -125 350 -71 182 -130 333 -130 336 0 3 482 5 1070 5 1057 0 1070 0 1090 20 19 19 20 33 20 295 0 262 -1 276 -20 295 -20 20 -33 20 -1090 20 -588 0 -1070 2 -1070 5 0 3 59 154 130 334 72 181 130 334 130 340 0 15 -37 51 -53 51 -8 0 -310 -227 -673 -505z" />{" "}
                <path d="M2952 2648 c-7 -7 -12 -21 -12 -33 0 -11 56 -163 125 -338 69 -174 126 -321 127 -327 2 -7 -334 -10 -1057 -10 -835 0 -1065 -3 -1085 -13 l-25 -13 0 -294 0 -294 25 -13 c20 -10 257 -12 1084 -13 583 0 1060 -1 1061 -2 1 -2 -56 -149 -126 -327 -71 -179 -129 -335 -129 -348 0 -35 43 -52 79 -32 38 23 1250 956 1286 990 25 24 28 32 20 53 -14 35 -1305 1026 -1337 1026 -13 0 -29 -5 -36 -12z" />{" "}
              </g>{" "}
            </svg>
          </button>
          {result != "Invalid input" && (
            <>
              <h2
                className={`text-2xl font-bold my-2 ${numInput === "" || !showResult ? "hidden" : ""}`}
              >
                Result:
              </h2>
              <div
                className={`w-full md:w-1/2 ${numInput === "" || !showResult ? "hidden" : ""}`}
              >
                <div className="relative m-2">
                  <input
                    type="text"
                    value={result}
                    readOnly
                    className="bg-inherit rounded-md border-2 w-full text-center border-black dark:border-white border-spacing-2 text-2xl font-bold pr-10"
                  ></input>
                  <button
                    type="button"
                    aria-label="Copy result"
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded fill-black dark:fill-white hover:fill-blue-500 dark:hover:fill-blue-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-5 h-5"
                    >
                      <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" />
                    </svg>
                  </button>
                </div>
              </div>
              {baseInput[0] === "2" ? (
                <>
                  <h2
                    className={`text-2xl font-bold my-2 ${numInput === "" || !showResult ? "hidden" : ""}`}
                  >
                    2's Complement:
                  </h2>
                  <div
                    className={`w-full md:w-1/2 ${numInput === "" || !showResult ? "hidden" : ""}`}
                  >
                    <div className="relative m-2">
                      <input
                        type="text"
                        value={twosComplement(numInput)}
                        readOnly
                        className="bg-inherit rounded-md border-2 w-full text-center border-black dark:border-white border-spacing-2 text-2xl font-bold pr-10"
                      ></input>
                      <button
                        type="button"
                        aria-label="Copy result"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            twosComplement(numInput),
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded fill-black dark:fill-white hover:fill-blue-500 dark:hover:fill-blue-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          className="w-5 h-5"
                        >
                          <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : baseInput[1] === "2" ? (
                <>
                  <h2
                    className={`text-2xl font-bold my-2 ${numInput === "" || !showResult ? "hidden" : ""}`}
                  >
                    2's Complement:
                  </h2>
                  <div
                    className={`w-full md:w-1/2 ${numInput === "" || !showResult ? "hidden" : ""}`}
                  >
                    <div className="relative m-2">
                      <input
                        type="text"
                        value={twosComplement(result)}
                        readOnly
                        className="bg-inherit rounded-md border-2 w-full text-center border-black dark:border-white border-spacing-2 text-2xl font-bold pr-10"
                      ></input>
                      <button
                        type="button"
                        aria-label="Copy result"
                        onClick={() => {
                          navigator.clipboard.writeText(twosComplement(result));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded fill-black dark:fill-white hover:fill-blue-500 dark:hover:fill-blue-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          className="w-5 h-5"
                        >
                          <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {result === "Invalid input" && (
            <h2 className="text-2xl font-bold my-2 text-red-500">
              Invalid input
            </h2>
          )}
        </div>
      </div>
    </>
  );
}
