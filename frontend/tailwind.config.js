/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    50: '#EBEFE9',
                    100: '#CDE0D2',
                    200: '#99C2A5',
                    300: '#66A378',
                    400: '#408756',
                    500: '#2C4F38', // Primary: Deep Forest Green
                    600: '#233F2D',
                    700: '#1A2F22',
                    800: '#111F16',
                    900: '#09100B',
                },
                sand: {
                    50: '#FFFEFC',
                    100: '#F9F7F2', // Secondary: Cream / Bone
                    200: '#EFEBE0',
                    300: '#E5DFCE',
                    400: '#DBD3BC',
                    500: '#D1C7AA',
                    600: '#A79F88',
                    700: '#7D7766',
                    800: '#544F44',
                    900: '#2A2822',
                },
                gold: {
                    400: '#E6C49C',
                    500: '#D4A373', // Accent: Harvest Gold
                    600: '#AA825C',
                },
                charcoal: {
                    500: '#333333', // Text
                    light: '#4D4D4D',
                }
            }
        },
    },
    plugins: [],
}
