/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1A1A1A',
        aesthetiq: {
          dark: '#111111',
          red: '#EF4444',
          gold: '#eab308',
          green: '#22c55e',
          gray: '#27272a',
          light: '#fafafa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 12s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { backgroundPosition: '0% 50%', transform: 'scale(1)' },
          '50%': { backgroundPosition: '100% 50%', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}

