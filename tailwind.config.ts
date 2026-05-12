import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  // Always dark — no class toggle needed; CSS variables define the dark palette unconditionally
  darkMode: 'media',
  theme: {
    extend: {
      // === Colors (all backed by CSS variables — no raw values in components) ===
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          elevated: 'var(--background-elevated)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
          tertiary: 'var(--foreground-tertiary)',
          quaternary: 'var(--foreground-quaternary)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        fill: {
          DEFAULT: 'var(--fill)',
          secondary: 'var(--fill-secondary)',
          tertiary: 'var(--fill-tertiary)',
          quaternary: 'var(--fill-quaternary)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        ring: 'var(--ring)',
        overlay: 'var(--overlay)',
      },

      // === Typography — Geist (layout-injected) with Apple system font fallback ===
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'var(--font-geist-mono)',
          'SF Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },

      // === Font sizes (Apple HIG type scale) ===
      fontSize: {
        'caption2':    ['11px', { lineHeight: '13px', letterSpacing: '0.06px' }],
        'caption1':    ['12px', { lineHeight: '16px', letterSpacing: '0px' }],
        'footnote':    ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],
        'subheadline': ['15px', { lineHeight: '20px', letterSpacing: '-0.23px' }],
        'callout':     ['16px', { lineHeight: '21px', letterSpacing: '-0.32px' }],
        'body':        ['17px', { lineHeight: '22px', letterSpacing: '-0.41px' }],
        'headline':    ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '600' }],
        'title3':      ['20px', { lineHeight: '25px', letterSpacing: '0.38px' }],
        'title2':      ['22px', { lineHeight: '28px', letterSpacing: '0.35px' }],
        'title1':      ['28px', { lineHeight: '34px', letterSpacing: '0.36px' }],
        'largetitle':  ['34px', { lineHeight: '41px', letterSpacing: '0.37px' }],
      },

      // === Border Radius (Apple HIG: 6px controls, 10px cards, 14px elevated, 20px modals) ===
      borderRadius: {
        sm:    'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg:    'var(--radius-lg)',
        xl:    'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full:  '9999px',
      },

      // === Shadows ===
      boxShadow: {
        sm:    'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        lg:    'var(--shadow-lg)',
        xl:    'var(--shadow-xl)',
        'primary-glow': 'var(--shadow-primary-glow)',
        'success-glow': 'var(--shadow-success-glow)',
        'inset': 'var(--shadow-inset)',
      },

      // === Backdrop blur (Apple vibrancy / frosted glass) ===
      backdropBlur: {
        apple:    '20px',
        'apple-lg': '40px',
        'apple-xl': '80px',
      },

      // === Transitions — Apple easing curves ===
      transitionTimingFunction: {
        'apple-ease':   'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'apple-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'apple-out':    'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },

      // === Keyframe animations ===
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in':      'fade-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'fade-out':     'fade-out 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'slide-up':     'slide-up 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down':   'slide-down 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'slide-in-left':'slide-in-left 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'scale-in':     'scale-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
