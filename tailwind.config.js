/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060A14',
          900: '#0A0F1A',
          800: '#1A2435',
          700: '#243447',
        },
        signal: {
          DEFAULT: '#2A7DE1',
          light: '#5A9DEF',
          dark: '#1E5FA8',
        },
        safety: {
          DEFAULT: '#E8634A',
          light: '#F08572',
        },
        paper: '#F4F7FA',
        'cool-gray': '#8A94A6',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'boot-in': 'bootIn 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        bootIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
