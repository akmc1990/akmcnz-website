import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'church-navy': '#1a2b4a',
        'church-gold': '#c9a84c',
        'church-red': '#c0392b',
        'church-teal': '#2e8b6b',
        'church-light': '#f8f9fa',
        'church-cream': '#fdf8f0',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
