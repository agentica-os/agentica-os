/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d3748',
          850: '#1a202c',
          950: '#0a0f1a',
        },
      },
      animation: {
        'pulse-once': 'pulse 0.5s ease-in-out 1',
      },
    },
  },
  plugins: [],
};