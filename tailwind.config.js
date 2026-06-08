/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",      // Indigo do botão
        background: "#0f172a",   // Slate Dark de fundo
        card: "#1e293b",         // Cor dos cards
        border: "#334155",       // Bordas discretas[cite: 4]
      },
    },
  },
  plugins: [],
}