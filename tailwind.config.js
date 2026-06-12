/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#050816',
        panel: 'rgba(12, 18, 38, 0.68)',
        line: 'rgba(148, 163, 184, 0.18)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(99, 102, 241, 0.24)',
        card: '0 24px 80px rgba(2, 6, 23, 0.42)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
