import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          glow: 'var(--accent-glow)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
        'glitch-after': 'glitch var(--after-duration) infinite linear alternate-reverse',
        'glitch-before': 'glitch var(--before-duration) infinite linear alternate-reverse',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
        glitch: {
          '0%': { 'clip-path': 'inset(20% 0 50% 0)' },
          '5%': { 'clip-path': 'inset(10% 0 60% 0)' },
          '10%': { 'clip-path': 'inset(15% 0 55% 0)' },
          '15%': { 'clip-path': 'inset(25% 0 35% 0)' },
          '20%': { 'clip-path': 'inset(30% 0 40% 0)' },
          '25%': { 'clip-path': 'inset(40% 0 20% 0)' },
          '30%': { 'clip-path': 'inset(10% 0 60% 0)' },
          '35%': { 'clip-path': 'inset(15% 0 55% 0)' },
          '40%': { 'clip-path': 'inset(25% 0 35% 0)' },
          '45%': { 'clip-path': 'inset(30% 0 40% 0)' },
          '50%': { 'clip-path': 'inset(20% 0 50% 0)' },
          '55%': { 'clip-path': 'inset(10% 0 60% 0)' },
          '60%': { 'clip-path': 'inset(15% 0 55% 0)' },
          '65%': { 'clip-path': 'inset(25% 0 35% 0)' },
          '70%': { 'clip-path': 'inset(30% 0 40% 0)' },
          '75%': { 'clip-path': 'inset(40% 0 20% 0)' },
          '80%': { 'clip-path': 'inset(20% 0 50% 0)' },
          '85%': { 'clip-path': 'inset(10% 0 60% 0)' },
          '90%': { 'clip-path': 'inset(15% 0 55% 0)' },
          '95%': { 'clip-path': 'inset(25% 0 35% 0)' },
          '100%': { 'clip-path': 'inset(30% 0 40% 0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
