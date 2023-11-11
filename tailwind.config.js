const plugin = require("tailwindcss/plugin")


module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        maak: {
          black: "#1f1f1f",
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities }) {
      /** @type {import('@types/tailwindcss').Utility} */
      const utilities = {
        ".fade-in-out": {
          transition: "all 200ms ease-in-out",
        },
      }

      addUtilities(utilities, ["responsive", "hover"]) // Variants
    }),
  ],
}