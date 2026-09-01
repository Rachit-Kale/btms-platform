/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#b4f000',
          300: '#bef264',
          400: '#b4f000',
          500: '#84cc16',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'lime-glow': '0 0 25px rgba(180, 240, 0, 0.25)',
        'lime-sm': '0 0 10px rgba(180, 240, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
