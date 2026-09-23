/** @type {import('tailwindcss').Config} */

// Colors come from CSS variables (see src/index.css) so light/dark share one class list,
// and `<alpha-value>` lets us write things like `bg-progress/50`.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('--canvas'),
        surface: token('--surface'),
        ink: token('--ink'),
        muted: token('--muted'),
        line: token('--line'),
        accent: token('--accent'),
        'accent-ink': token('--accent-ink'),
        slice: token('--slice'),
        progress: token('--progress'),
        good: token('--good'),
        'good-soft': token('--good-soft'),
        gentle: token('--gentle'),
        'gentle-soft': token('--gentle-soft'),
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Atkinson Hyperlegible"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        tip: '0 12px 28px -8px rgb(var(--shadow) / 0.28), 0 4px 10px -4px rgb(var(--shadow) / 0.18)',
      },
    },
  },
  plugins: [],
}
