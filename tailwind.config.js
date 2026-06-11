/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                brandLime: '#cbfb00', // PropertyNext Brand Color
                darkGreen: '#051c14'
            }
        },
    },
    plugins: [],
}