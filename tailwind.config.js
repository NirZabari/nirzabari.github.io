/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        background: {
          light: '#F8FAFC', // Lighter background for better contrast
          dark: '#0F172A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        accent: {
          light: '#E0F2FE',
          dark: '#0F172A',
        },
      },
      boxShadow: {
        'soft-light': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 2px 15px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};