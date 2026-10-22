import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#F7F7F2',
          forest: '#1B4332',
          body: '#40513B',
          mint: '#74C69D',
          leaf: '#52B788',
          pale: '#D8F3DC',
        },
      },
    },
  },
  plugins: [],
}

export default config
