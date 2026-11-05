/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cinema: {
          950: '#06070a', // Deep obsidian canvas
          900: '#0c0e14', // Recessed cockpit surface
          850: '#11141c', // Card container
          800: '#171b26', // Border & elevated planes
          700: '#232938', // High-contrast borders
          gold: '#eab308', // Amber cinema projector glow
          emerald: '#10b981', // Hi-Fi audio indicator
          cyan: '#06b6d4',  // Direct WebRTC link
        }
      },
      boxShadow: {
        'cinema-glow': '0 0 50px -10px rgba(234, 179, 8, 0.12)',
        'player-stage': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(99, 102, 241, 0.15)',
        'tactile-card': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grain-grid': 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%), linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
