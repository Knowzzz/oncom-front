module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      borderRadius: {
        '4xl': '8rem',
      },
      spacing: {
        '18': '4.5rem', // Ajoutez cette ligne
      },

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
