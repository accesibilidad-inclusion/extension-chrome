/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
              'yellow': '#F6C254',
              'yellow-light': '#FADA98',
              'blue-dark': '#041C42',
              'blue': '#004079',
              'skyblue': '#A1C9FF',
              'skyblue-light': '#CAE0FF',
            },
            fontFamily: {
              'sans': ['Open Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

