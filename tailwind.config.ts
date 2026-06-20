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
                            'church-navy': '#1a1a1a',
                            'church-blue': '#2563eb',
                            'church-gold': '#f59e0b',
                            'church-red': '#dc2626',
                            'church-teal': '#2563eb',
                            'church-light': '#f8f9fa',
                            'church-cream': '#ffffff',
                            'church-dark': '#0f0f0f',
                            'church-gray': '#6b7280',
                  },
                  fontFamily: {
                            sans: ['Noto Sans KR', 'sans-serif'],
                            impact: ['Impact', 'Haettenschweiler', 'Franklin Gothic Bold', 'Charcoal', 'sans-serif'],
                  },
          },
    },
    plugins: [],
};

export default config;
