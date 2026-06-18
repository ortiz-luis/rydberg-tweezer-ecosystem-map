/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#05070b",
        panel: "#0b111a",
        line: "#243244",
        cyanCore: "#54d5ff",
        amberRel: "#f4c96b",
        mintAdj: "#83e6b4",
      },
    },
  },
  plugins: [],
};
