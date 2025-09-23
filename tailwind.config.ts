import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './docs/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0f172a',
          accent: '#f97316'
        }
      }
    }
  },
  plugins: []
};

export default config;
