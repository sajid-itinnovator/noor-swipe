/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./.agent/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary App Colors (Generic)
                primary: "#137fec", // Blue for Settings/General
                "primary-green": "#13ec5b", // Green for Badges/Success
                "primary-orange": "#ec7f13", // Orange for Leaderboard
                "primary-purple": "#8e44ad", // Junior/Creative

                // Backgrounds
                "background-light": "#f6f8f6",
                "background-dark": "#121212", // Main Dark Theme
                "surface-dark": "#1e1e1e",
                "card-bg": "#242624",
                "card-grey": "#2A2A2A",
                "charcoal": "#1a1c1a",
                "neutral-accent": "#2a2118",

                // Theme Specific (From User HTML)
                "orange-bg-light": "#f8f7f6",
                "orange-bg-dark": "#221910",
                "blue-bg-light": "#f6f7f8",
                "blue-bg-dark": "#101922",
                "blue-surface-dark": "#1e1e1e", // Re-using if same, but keeping distinct for clarity if needed
                "blue-charcoal": "#1c2632",
                "blue-charcoal-dark": "#0d141c",

                // Text/Status
                silver: "#A0A0A0",
                accent: "#F59E0B", // Gold/Yellow
                "success-green": "#2ecc71",
                "error-red": "#e74c3c",
            },
            fontFamily: {
                display: ["Lexend", "sans-serif"],    // Main Headings / UI
                body: ["Inter", "sans-serif"],        // General Text
                arabic: ["Amiri", "Lateef", "Noto Sans Arabic", "sans-serif"], // Arabic Content
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem", // For cards
                full: "9999px"
            },
            screens: {
                'xs': '375px',
                'mobile': '480px',
            },
            touchAction: {
                'pan-y': 'pan-y',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
