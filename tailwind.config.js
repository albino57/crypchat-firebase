/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', //Habilita a estratégia de classe para temas
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'rgb(var(--color-background))',
        'surface': 'rgb(var(--color-surface))',
        'primary': 'rgb(var(--color-primary))',
        'primary-dark': 'rgb(var(--color-primary-dark))',
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
      }
    },
  },
  plugins: [],
}