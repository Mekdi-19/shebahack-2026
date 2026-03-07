/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CFAF2F',
        secondary: '#E63946',
        background: '#FFFFFF',
        text: '#333333',
      },
    },
  },
  plugins: [],
}
