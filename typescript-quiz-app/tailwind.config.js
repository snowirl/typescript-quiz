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
        primary: "#1EB4B6",
        secondary: "#ffed4a",
        dark: {
          1: "#18181b",
          2: "#0f0f11",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        disabledOpacity: "0.3", // opacity-[0.3]
        radius: {
          // small: "2px", // rounded-small
          // medium: "4px", // rounded-medium
          // large: "6px", // rounded-large
        },
        borderWidth: {
          // small: "1px", // border-small
          // medium: "1px", // border-medium
          // large: "2px", // border-large
        },
      },
      themes: {
        light: {},
        dark: {},
      },
    }),
  ],
  important: true,
  safelist: [
    "bg-zinc-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
    "text-zinc-500",
    "text-red-500",
    "text-orange-500",
    "text-amber-500",
    "text-yellow-500",
    "text-lime-500",
    "text-green-500",
    "text-teal-500",
    "text-cyan-500",
    "text-blue-500",
    "text-indigo-500",
    "text-violet-500",
    "text-fuchsia-500",
    "text-pink-500",
    "text-rose-500",
  ],
};
