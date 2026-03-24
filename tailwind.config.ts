import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:    "#12665E", // teal
          secondary:  "#053333", // deep forest
          accent:     "#E1FFA0", // lime pop
          dark:       "#1B1F20", // near-black
          light:      "#EBF5F1", // soft mint bg
          white:      "#FCFEFD", // off-white
          border:     "#e8eae9",
        },
      },
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1B1F20",
            a: { color: "#12665E", "&:hover": { color: "#053333" } },
            "h1,h2,h3,h4": { color: "#053333", fontFamily: "Noto Sans, sans-serif" },
            code: { color: "#12665E" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
