/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dmun: "#3d7dd2", // DMUN Blue
        dmunlight: "#9EBEE9", // DMUN Blue 50% opacity
        dmunultralight: "#DFF4F4", // DMUN Blue 50% opacity
        primary: "#3d7dd2", // Primary Color, until specified remains DMUN Blue
        secondary: "#ffc200", // For now, Orange
        highlight: "#DFF4F4",
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
