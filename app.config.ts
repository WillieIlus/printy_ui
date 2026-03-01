import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef4ee',
          100: '#fde6d7',
          200: '#fbc9ad',
          300: '#f7a37a',
          400: '#f37344',
          500: '#f05224',
          600: '#e13515',
          700: '#bb2513',
          800: '#942018',
          900: '#781d16',
          950: '#410b09',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
    },
  },
}