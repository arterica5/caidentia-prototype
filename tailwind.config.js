/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  
}

fontFamily: {
  sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['"Roboto Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
}
