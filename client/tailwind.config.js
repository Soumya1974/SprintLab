module.exports = {
  plugins: [require("tailwind-scrollbar-hide")],
};

module.exports = {
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
      animation: {
        blink: "blink 1.4s ease-in-out infinite",
      },
    },
  },
};