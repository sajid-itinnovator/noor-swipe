/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./.agent/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-purple': '#8e44ad',
                'success-green': '#2ecc71',
                'error-red': '#e74c3c',
            }
        },
    },
    plugins: [],
}
