module.exports = {
  mode: "jit",
  purge: ['index.html','assets/js/**'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'ls': {'raw': '(orientation: landscape)'},
        // => @media (orientation: portrait) { ... }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
}
