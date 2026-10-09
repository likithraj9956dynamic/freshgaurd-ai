/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Mint green accent
          600: '#059669',
          700: '#047857', // Forest green
          800: '#065f46',
          900: '#064e3b', // Deep Forest green for briefing banner
          950: '#022c22',
        },
        surface: {
          base: '#f8fafc',    // Soft off-white / pale slate
          subtle: '#f1f5f9',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        risk: {
          highBg: '#fee2e2',
          highText: '#b91c1c',
          highBorder: '#fecaca',
          medBg: '#fef3c7',
          medText: '#b45309',
          medBorder: '#fde68a',
          watchBg: '#d1fae5',
          watchText: '#047857',
          watchBorder: '#a7f3d0',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        floating: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
