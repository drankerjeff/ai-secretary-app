import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  // Always dark — no class toggle needed
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
      },

      // === Typography — Apple system font stack ===
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },

      // === Font sizes (Apple HIG type scale) ===
      fontSize: {
        'caption2': ['11px', { lineHeight: '13px', letterSpacing: '0.06px' }],
        'caption1': ['12px', { lineHeight: '16px', letterSpacing: '0px' }],
        'footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],
        'subheadline': ['15px', { lineHeight: '20px', letterSpacing: '-0.23px' }],
        'callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.32px' }],
        'body': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px' }],
        'headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '600' }],
        'title3': ['20px', { lineHeight: '25px', letterSpacing: '0.38px' }],
        'title2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px' }],
        'title1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px' }],
        'largetitle': ['34px', { lineHeight: '41px', letterSpacing: '0.37px' }],
      },

      // === Border Radius (Apple HIG: cards 10-14px, modals 20px) ===
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: '9999px',
      },

      // === Shadows ===
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        // Glow effects for interactive elements
        'primary-glow': 'var(--shadow-primary-glow)',
      },

      // === Backdrop blur (Apple vibrancy / frosted glass) ===
      backdropBlur: {
        apple: '20px',
        'apple-lg': '40px',
        'apple-xl': '80px',
      },

      // === Transitions ===
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'apple-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
