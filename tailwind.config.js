/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F6F7F4',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#1A2340',
          soft: '#4A5270',
          faint: '#8B92A8',
        },
        mark: '#B23A2E',
        line: '#E4E4DF',
        class: {
          1: '#3D4E82',
          2: '#2A7A72',
          3: '#B07D2B',
          4: '#B0512E',
          5: '#6B4A7A',
        },
        classSoft: {
          1: '#EEF0F7',
          2: '#EAF3F1',
          3: '#F7F1E5',
          4: '#F7ECE7',
          5: '#F1ECF3',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '42rem',
      },
      boxShadow: {
        slide: '0 1px 2px rgba(26,35,64,0.06), 0 8px 24px -12px rgba(26,35,64,0.18)',
      },
    },
  },
  plugins: [],
};
