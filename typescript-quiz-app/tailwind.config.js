/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        primary: "#00B4A0",
        secondary: "#ffed4a",
        dark: {
          1: "#18181B",
          2: "#0f0f11",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
  important: true,
};
