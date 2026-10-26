/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./app.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#064734',
        secondary: '#e0ffc2',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
