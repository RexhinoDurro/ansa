/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Custom Furniture Studio Colors
        cream: {
          50: '#FAFAF7',
          100: '#F7F3EE',
          200: '#F0EAE3',
          300: '#E8E0D5',
          400: '#D9CDC0',
          500: '#C9BAA9',
        },
        brown: {
          900: '#241D1A',
          800: '#1F2933',
          700: '#3E3632',
          600: '#57534E',
        },
        // Deep green accent (primary choice)
        accent: {
          DEFAULT: '#1F4D3A',
          dark: '#163A2C',
          light: '#2D6B4F',
          50: '#F0F7F4',
          100: '#D6E9DE',
          200: '#9FCFB8',
          300: '#5EA989',
          400: '#2D6B4F',
          500: '#1F4D3A',
          600: '#163A2C',
          700: '#0F2A1F',
          800: '#0A1C15',
          900: '#050E0A',
        },
        // Alternative: Terracotta accent (if preferred over green)
        terracotta: {
          DEFAULT: '#C46A3C',
          dark: '#A05530',
          light: '#D68655',
          50: '#FBF3ED',
          100: '#F6E3D5',
          200: '#EDCAB3',
          300: '#E1A987',
          400: '#D68655',
          500: '#C46A3C',
          600: '#A05530',
          700: '#7C4024',
          800: '#58301B',
          900: '#351D10',
        },
        // Keep existing neutral for compatibility
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Work Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],        // 56px
        'section': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],     // 40px
        'subsection': ['2rem', { lineHeight: '1.25' }],                            // 32px
      },
      borderRadius: {
        'card': '1.5rem',      // 24px
        'card-sm': '1rem',     // 16px
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
