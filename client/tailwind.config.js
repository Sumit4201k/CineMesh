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
        // Exact palette matched to the official CineMesh brand logo:
        brand: {
          purple: '#6d18f2',      // Vibrant violet-purple
          purpleHover: '#5b12d1',
          purpleLight: '#8a3df7',
          cyan: '#00f2fe',        // Electric cyan mesh node
          cyanHover: '#00d5e0',
          navy: '#120f38',        // Deep Cine indigo-navy
          canvas: '#080616',      // Ultra deep obsidian-navy background
          card: '#0f0c24',        // Cockpit elevated card surface
          cardHover: '#171333',
          border: '#241e4a',      // Subtle purple-navy border
          borderLight: '#393070',
        },
        cinema: {
          950: '#080616',
          900: '#0f0c24',
          850: '#14102e',
          800: '#1e1844',
          700: '#2c2363',
          accent: '#6d18f2',
          cyan: '#00f2fe',
        }
      },
      boxShadow: {
        'brand-glow': '0 0 35px -5px rgba(109, 24, 242, 0.45)',
        'cyan-glow': '0 0 25px -3px rgba(0, 242, 254, 0.4)',
        'player-stage': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(109, 24, 242, 0.25)',
        'tactile-card': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 10px 30px -10px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'mesh-glow': 'radial-gradient(circle at 50% 0%, rgba(109, 24, 242, 0.18) 0%, transparent 60%), radial-gradient(circle at 100% 50%, rgba(0, 242, 254, 0.08) 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}
