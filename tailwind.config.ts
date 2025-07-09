
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import lineClamp from "@tailwindcss/line-clamp";


const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.25s ease-out',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [
    lineClamp,
    animate,
  ],
};

export default config;