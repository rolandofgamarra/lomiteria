/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D62828", // ZarfPizzas Red
        secondary: "#FBF3E8", // Beige base
        accent: "#7A1E1E", // Deep red accent
        surface: "#FFF9F1", // Warm panel
        text: "#24130F", // Dark espresso
      },
    },
  },
  plugins: [],
}
