// tailwind.config.js
/* eslint-disable no-undef */
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: { 'fade-in': 'fade 0.18s ease-out' },
      keyframes: { 
        fade: { 
          '0%': { opacity:0, transform:'translateY(-4px)' }, 
          '100%': { opacity:1, transform:'translateY(0)' } 
        } 
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};