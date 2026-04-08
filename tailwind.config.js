/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── SOMA Brand Colors ──────────────────────────────
        orange: {
          DEFAULT: '#F7941D',
          dark:    '#d97d0f',
          light:   '#fbb04b',
        },
        soma: {
          black:    '#111111',
          dark:     '#1e1e1e',
          card:     '#2b2b2b',
          gray:     '#f0f0f0',
          midgray:  '#e2e2e2',
          textgray: '#888888',
        },
      },
      fontFamily: {
        // ── FONT: Brunson (títulos) – substituir se tiver a fonte licenciada.
        //    Usando Bebas Neue como substituto visual de alta fidelidade.
        display: ['"Bebas Neue"', 'sans-serif'],
        // ── FONT: Poppins – textos menores, corpo, labels ──
        body: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '100px',
      },
      animation: {
        'fade-up':     'fadeUp 0.6s ease forwards',
        'fade-in':     'fadeIn 0.4s ease forwards',
        'scroll-pulse':'scrollPulse 2s ease-in-out infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%':      { opacity: '0.3', transform: 'scaleY(0.5)' },
        },
      },
      backgroundImage: {
        'soma-gradient': 'linear-gradient(135deg, #F7941D 0%, #d97d0f 100%)',
      },
    },
  },
  plugins: [],
}
