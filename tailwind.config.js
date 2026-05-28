/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060610', surface: '#0d0d1f', surface2: '#13132a',
        border: 'rgba(255,255,255,0.08)',
        accent: '#6c47ff', accent2: '#ff4791', accent3: '#00d4aa',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
