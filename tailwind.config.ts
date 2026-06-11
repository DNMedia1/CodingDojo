import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace']
      },
      colors: {
        ink: '#0b0f14',
        panel: '#121923',
        panelSoft: '#182231',
        line: '#273245',
        text: '#eef4ff',
        muted: '#91a0b8'
      },
      boxShadow: {
        glow: '0 22px 70px rgba(0, 0, 0, 0.34)'
      }
    }
  },
  plugins: []
} satisfies Config;
