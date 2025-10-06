/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#f0f2f5', // Um cinza bem claro para o fundo
        'surface': '#ffffff',    // Branco para as caixas e formulários
        'primary': '#0b93f6',    // Um azul vibrante para botões e destaques
        'primary-dark': '#0a84dc',// Um tom mais escuro do azul para o hover
        'text-primary': '#1c1e21',  // Preto suave para textos principais
        'text-secondary': '#65676b',// Cinza para textos secundários
      }
    },
  },
  plugins: [],
}