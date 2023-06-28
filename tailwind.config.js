/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        screen: '100vh',
      },
      minWidth: {
        screen: '100vw',
      },
    },
  },
  plugins: [],
};
