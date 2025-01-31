/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        LeagueSpartan: ['LeagueSpartan-Regular', 'sans-serif'],
        "LeagueSpartan-Bold": ["LeagueSpartan-Bold", "sans-serif"],
        LaoSansPro: ['LaoSansPro-Regular', 'sans-serif'],
      },
      colors: {
        "bg": {
          light: '#EEEED0',
          medium: '#F6C49E',
          dark: '#003049',
        },
        "txt": {
          orange: '#FF6B35',
          blue:'#004E89',
          darkblue: '#003049',
          light: '#EEEED0',
          black: '#000000',
        }
      }
    },
  },
  plugins: [],
}