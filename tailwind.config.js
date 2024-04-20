/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        onlineShadow: "5px 5px 10px 0px rgba(0,0,0,0.25)"
      }
    },
  },
  plugins: [],
}