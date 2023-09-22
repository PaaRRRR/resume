/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "line-seperator": "radial-gradient(closest-side, #d2d2d7, transparent)",
        "hero-logo":
          "linear-gradient(90deg,#fff,hsla(0,0%,100%,0) 20%,hsla(0,0%,100%,0) 80%,#fff)",
      },
    },
    fontFamily: {
      pretendard: ["Pretendard", "sans-serif"],
    },
  },
  plugins: [],
};
