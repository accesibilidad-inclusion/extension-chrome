/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'light-yellow': '#FADA98',
                'dark-yellow': '#F6C254',
                'dark-blue': '#041C42',
                'sblue-light': '#CAE0FF',
                'sblue': '#A1C9FF',
              },
        },
    },
    plugins: [],
};

