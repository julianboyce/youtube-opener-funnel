import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 80px rgba(239, 68, 68, 0.24)',
      },
    },
  },
  plugins: [],
};

export default config;
