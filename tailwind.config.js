/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using CSS variables to allow dynamic theme switching without changing class names
        // Naming convention follows the Brand Colors but their values flip based on theme
        'honed-sage': 'var(--honed-sage)',      // Accent Color
        'steel-gray': 'var(--steel-gray)',      // Secondary Text / Borders
        'whetstone-cream': 'var(--whetstone-cream)', // Main Background
        'damascus-bronze': 'var(--damascus-bronze)', // Secondary Accent / Highlights
        'carbon-black': 'var(--carbon-black)',  // Main Text
        'edge-white': 'var(--edge-white)',      // Card / Component Background
        'dark-input': 'var(--dark-input)',      // Form Input Background
      },
      fontFamily: {
        'serif': ['Della Respira', 'Georgia', 'serif'],
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}