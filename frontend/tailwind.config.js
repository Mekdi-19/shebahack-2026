/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F06292',
        secondary: '#E91E63',
        background: '#FFFFFF',
        text: '#333333',
        'pink-light': '#FCE4EC',
        'pink-medium': '#F8BBD0',
        'pink-dark': '#D81B60',
        'pink-darker': '#C2185B',
        'pink-bold': '#AD1457',
      },
    },
  },
  plugins: [],
}
