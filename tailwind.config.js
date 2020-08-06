module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    typography: (theme) => ({
      default: {
        css: {
          color: theme('colors.gray.700'),
          strong: {
            color: theme('colors.orange.600'),
            background: theme('colors.white'),
            padding: '2px'
          },
          code: {
            color: theme('colors.orange.600'),
            background: theme('colors.white'),
          },
          a: {
            color: theme('colors.orange.500'),
            paddingBottom: '1px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderBottom: '2px solid ' + theme('colors.orange.500'),
            '&:hover': {
              color: theme('colors.orange.400'),
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
