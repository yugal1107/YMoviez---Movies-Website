import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        blob: "blob 7s infinite",
        gradient: "gradient 3s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      fontSize: {
        heading: [
          "clamp(2rem, 4vw, 2.75rem)",
          { lineHeight: "1.2", fontWeight: "700" },
        ],
        subheading: [
          "clamp(1.5rem, 3vw, 2rem)",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        body: [
          "clamp(1rem, 2vw, 1.125rem)",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        caption: [
          "clamp(0.85rem, 1vw, 1rem)",
          { lineHeight: "1.4", fontWeight: "400" },
        ],
        small: [
          "clamp(0.75rem, 0.8vw, 0.875rem)",
          { lineHeight: "1.3", fontWeight: "400" },
        ],
      },
    },
  },
  plugins: [heroui()],
  darkMode: "class",
};
