/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        screen: '100vh', // Set minimum height to 100% of the viewport height
      },
      minWidth: {
        screen: '100vw', // Set minimum width to 100% of the viewport width
      },
    },
  },
  plugins: [],
};
