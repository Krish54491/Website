/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jolteonYellow: "#fcd877",
      },
      dropShadow: {
        whiteGlow: "0px 0px 5px rgba(255, 255, 255, 0.9)",
        redGlow: "0px 0px 25px rgba(255, 0, 0, 0.9)",
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        scale: "scale 1s linear infinite",
        smallspin: "smallspin 1s linear infinite",
        yellowGlow: "yellowGlow 1s ease-in-out infinite",
        redGlow: "redGlow 1s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        scale: {
          "0%, 100%": { transform: "scale(100%)" },
          "50%": { transform: "scale(90%)" },
        },
        smallspin: {
          "0%": { transform: "scale(100%)" },
          "50%": { transform: "scale(85%) rotate(180deg)" },
          "100%": { transform: "scale(100%) rotate(360deg)" },
        },
        yellowGlow: {
          "0%, 100%": {
            filter: "drop-shadow(0px 0px 0px rgba(252, 239, 0, 0))",
          },
          "50%": {
            filter: "drop-shadow(0px 0px 25px rgba(252, 239, 0, 0.9))",
          },
        },
        redGlow: {
          "0%, 100%": {
            filter: "drop-shadow(0px 0px 0px rgba(252, 239, 0, 0))",
          },
          "50%": {
            filter: "drop-shadow(0px 0px 25px rgba(255, 0, 0, 0.9))",
          },
        },
      },
    },
  },
  plugins: [],
};
