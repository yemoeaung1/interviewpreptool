/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        merienda: ['Merienda', 'cursive'] // Add 'cursive' as a fallback
      },
      width: {
        'custom': '950px',
      },
      height: {
        'custom': '500px',
      },
    },
  },
  plugins: [require('daisyui')],
}

