/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#07090e',
          900: '#0d111a',
          800: '#151c2b',
          700: '#202b40',
          accent: '#6366f1',
          hifi: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
