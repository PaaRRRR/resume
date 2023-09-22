/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "line-seperator": "radial-gradient(closest-side, #d2d2d7, transparent)",
      },
    },
    fontFamily: {
      pretendard: ["Pretendard", "sans-serif"],
    },
  },
  plugins: [],
};
