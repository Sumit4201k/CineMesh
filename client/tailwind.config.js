/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Exact palette matched to the official CineMesh brand logo:
        brand: {
          purple: '#c63d2f',
          purpleHover: '#a92e22',
          purpleLight: '#e06a58',
          cyan: '#d9b36c',
          cyanHover: '#c59b50',
          navy: '#11110f',
          canvas: '#11110f',
          card: '#191916',
          cardHover: '#23231e',
          border: '#3a3932',
          borderLight: '#666257',
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
        'brand-glow': 'none',
        'cyan-glow': 'none',
        'player-stage': '0 18px 40px -24px rgba(0, 0, 0, 0.9)',
        'tactile-card': 'none',
      },
      backgroundImage: {
        'mesh-glow': 'linear-gradient(135deg, rgba(198,61,47,.08), transparent 42%)',
      }
    },
  },
  plugins: [],
}
