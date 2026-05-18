/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        apple: '#0071e3',
        canvas: '#f5f5f7',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.10)',
        soft: '0 12px 34px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        mac: '28px',
      },
    },
  },
  plugins: [],
};
