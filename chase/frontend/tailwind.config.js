/** @type {import('tailwindcss').Config} */

dmunColors = {
  100: "#0c192a",
  200: "#183254",
  300: "#254b7e",
  400: "#3164a8",
  500: "#3d7dd2", // DMUN Blue
  600: "#6497db",
  700: "#8bb1e4",
  800: "#b1cbed",
  900: "#d8e5f6",
  950: "#ecf2fb",
};

secondaryColors = {
  100: "#332700",
  200: "#664e00",
  300: "#997400",
  400: "#cc9b00",
  500: "#ffc200", // Secondary Orange
  600: "#ffce33",
  700: "#ffda66",
  800: "#ffe799",
  900: "#fff3cc",
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: { ...dmunColors, DEFAULT: dmunColors[500] },
        secondary: { ...secondaryColors, DEFAULT: secondaryColors[500] },
        highlight: {
          light: "#DFF4F4",
          dark: "#254b7e",
        },
        gray: {
          light: "#EEEEEE",
          icon: "rgb(156 163 175)",
          text: "rgb(75 85 99)",
        },
        voting: {
          for: "#188a42",
          against: "#ff3d32",
          abstain: "#3d7dd2",
        },
      },
    },
  },
};
