/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light theme colors (convertidas de oklch para hex/rgb)
        background: {
          DEFAULT: '#ffffff',
          dark: '#0a0a0b',
        },
        foreground: {
          DEFAULT: '#171717',
          dark: '#fafafa',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#262626',
          foreground: {
            DEFAULT: '#171717',
            dark: '#fafafa',
          },
        },
        popover: {
          DEFAULT: '#ffffff',
          dark: '#262626',
          foreground: {
            DEFAULT: '#171717',
            dark: '#fafafa',
          },
        },
        primary: {
          DEFAULT: '#f59e0b', // Amarelo/laranja baseado no seu tema web
          dark: '#fbbf24',
          foreground: {
            DEFAULT: '#fefce8',
            dark: '#fefce8',
          },
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          dark: '#404040',
          foreground: {
            DEFAULT: '#262626',
            dark: '#fafafa',
          },
        },
        muted: {
          DEFAULT: '#f4f4f5',
          dark: '#404040',
          foreground: {
            DEFAULT: '#737373',
            dark: '#a3a3a3',
          },
        },
        accent: {
          DEFAULT: '#f4f4f5',
          dark: '#404040',
          foreground: {
            DEFAULT: '#262626',
            dark: '#fafafa',
          },
        },
        destructive: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        border: {
          DEFAULT: '#e4e4e7',
          dark: '#404040',
        },
        input: {
          DEFAULT: '#e4e4e7',
          dark: '#404040',
        },
        ring: {
          DEFAULT: '#f59e0b',
          dark: '#fbbf24',
        },
        // Cores de gráficos
        chart: {
          1: '#fb923c',
          2: '#fbbf24',
          3: '#f59e0b',
          4: '#d97706',
          5: '#b45309',
        },
      },
      borderRadius: {
        lg: '0.65rem',
        md: '0.45rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}