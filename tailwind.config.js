/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian-inspired color palette
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff6b35',
          600: '#ea580c',
          700: '#c2410c',
        },
        navy: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#1e3a5f',
          600: '#1e3a8a',
          700: '#1e40af',
          800: '#0f172a',
          900: '#0c1222',
        },
        ashoka: {
          blue: '#000080',
          green: '#138808',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
