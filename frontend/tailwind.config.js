/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        legalBlack: '#121212',
        legalCharcoal: '#1F1F1F',
        silver: '#C0C0C0',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}