
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';


const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}', // ← 사용 중인 파일 확장자
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
        xl: '1rem', // 필요시 수정
      },
    },
  },
  plugins: [
    animate
  ],
};

export default config;