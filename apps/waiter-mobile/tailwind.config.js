/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EF4444", // ZarfPizzas Red
        secondary: "#1F2937", // Slate Gray
        accent: "#F59E0B", // Amber
      },
    },
  },
  plugins: [],
}
