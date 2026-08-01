/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050a15',
          card:    '#0f1419',
          surface: '#1a1f28',
          elevated: '#242b36',
          border:  '#2a3142',
        },
        brand: {
          indigo: '#6366F1',
          indigo2: '#4f46e5',
          violet: '#8b5cf6',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger:  '#f43f5e',
          info:    '#06b6d4',
        },
        cosmic: {
          950: '#030712',
          900: '#050a15',
          850: '#0f1419',
          800: '#1a1f28',
          700: '#2a3142',
        },
        ai: {
          violet: '#8b5cf6',
          indigo: '#6366f1',
          cyan:   '#06b6d4',
          emerald:'#10b981',
          rose:   '#f43f5e',
          amber:  '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'sm': ['14px', { lineHeight: '1.5', letterSpacing: '-0.012em' }],
        'base': ['16px', { lineHeight: '1.6', letterSpacing: '-0.013em' }],
        'lg': ['18px', { lineHeight: '1.6', letterSpacing: '-0.014em' }],
        'xl': ['20px', { lineHeight: '1.7', letterSpacing: '-0.015em' }],
      },
      boxShadow: {
        'sm':           '0 1px 2px 0 rgba(0,0,0,0.08)',
        'card':         '0 1px 3px 0 rgba(0,0,0,0.1), 0 8px 32px -8px rgba(99,102,241,0.12)',
        'card-hover':   '0 1px 3px 0 rgba(0,0,0,0.1), 0 16px 48px -12px rgba(99,102,241,0.2)',
        'glow-indigo':  '0 0 32px -4px rgba(99,102,241,0.35)',
        'glow-rose':    '0 0 32px -4px rgba(244,63,94,0.3)',
        'glow-emerald': '0 0 32px -4px rgba(16,185,129,0.3)',
        'glow-violet':  '0 0 32px -4px rgba(139,92,246,0.3)',
        'glow-cyan':    '0 0 32px -4px rgba(6,182,212,0.3)',
        'glass':        '0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
        'grid-md': '40px 40px',
      },
      spacing: {
        'gutter': '24px',
        'gutter-lg': '32px',
      },
      borderRadius: {
        'DEFAULT': '0.75rem',
        'sm': '0.5rem',
        'md': '0.875rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      opacity: {
        'glass': '0.65',
      },
      transitionDuration: {
        'sm': '150ms',
        'base': '200ms',
        'lg': '300ms',
        'xl': '500ms',
      },
    },
  },
  plugins: [],
}
