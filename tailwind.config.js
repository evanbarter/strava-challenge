module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    typography: (theme) => ({
      default: {
        css: {
          color: theme('colors.white'),
          strong: {
            color: theme('colors.purple.800'),
            background: theme('colors.white'),
            padding: '2px'
          },
          code: {
            color: theme('colors.purple.800'),
            background: theme('colors.white'),
          },
          a: {
            color: theme('colors.purple.500'),
            paddingBottom: '1px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderBottom: '2px solid ' + theme('colors.purple.500'),
            '&:hover': {
              color: theme('colors.purple.400'),
            },
          },
        },
      },
    }),
  },
  variants: {
    display: ['responsive', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
