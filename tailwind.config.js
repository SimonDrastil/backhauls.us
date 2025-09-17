const animatePlugin = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}", "./public/demo/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        backhauls: {
          blue: "#0B3C8A",
          dark: "#072B63",
          light: "#1552A2",
        },
        accent: {
          DEFAULT: "#2FB24C",
          dark: "#1F7F35",
          light: "#54D66C",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "radial-gradient(circle at top left, rgba(47,178,76,0.35), transparent 45%), linear-gradient(135deg, #031a3d, #0B3C8A 45%, #1552A2 80%)",
      },
      boxShadow: {
        glass: "0 10px 40px rgba(11, 60, 138, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [animatePlugin],
};
