/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        leagueSpartan: ['LeagueSpartan-Regular', 'sans-serif'],
        leagueSpartanBlack: ['LeagueSpartan-Black', 'sans-serif'],
        leagueSpartanBold: ['LeagueSpartan-Bold', 'sans-serif'],
        leagueSpartanExtraBold: ['LeagueSpartan-ExtraBold', 'sans-serif'],
        leagueSpartanExtraLight: ['LeagueSpartan-ExtraLight', 'sans-serif'],
        leagueSpartanLight: ['LeagueSpartan-Light', 'sans-serif'],
        leagueSpartanMedium: ['LeagueSpartan-Medium', 'sans-serif'],
        leagueSpartanSemiBold: ['LeagueSpartan-SemiBold', 'sans-serif'],
        leagueSpartanThin: ['LeagueSpartan-Thin', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
