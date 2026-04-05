/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0b0e',
          elevated: '#111217',
          card: '#16181f',
          hover: '#1c1e27',
        },
        border: {
          DEFAULT: '#2a2d38',
          accent: '#3d4252',
        },
        text: {
          DEFAULT: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        accent: {
          DEFAULT: '#00d4ff',
          glow: 'rgba(0, 212, 255, 0.3)',
          dim: 'rgba(0, 212, 255, 0.1)',
        },
        profit: {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.3)',
          dim: 'rgba(16, 185, 129, 0.1)',
        },
        loss: {
          DEFAULT: '#ef4444',
          glow: 'rgba(239, 68, 68, 0.3)',
          dim: 'rgba(239, 68, 68, 0.1)',
        },
        warning: '#f59e0b',
        premium: '#a855f7',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 8s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(0, 212, 255, 0.3)',
        'glow-green': '0 0 40px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 40px rgba(239, 68, 68, 0.3)',
      },
    },
  },
  plugins: [],
}