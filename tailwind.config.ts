import type { Config } from "tailwindcss"

const config = {
  darkMode: 'selector',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(36, 100%, 78%)",
          light: "hsl(56, 100%, 87%)",
          dark: "hsla(36, 94%, 54%, 1)",
        },
        purple: {
          DEFAULT: "hsla(231, 100%, 83%)",
          light: "hsla(231, 100%, 89%, 0.3)",
          dark: "hsla(231, 55%, 35%, 1)",
        },
        orange: {
          light: 'hsla(36, 69%, 86%, 0.4)',
          dark: "hsla(36,100%,24%,1)",
        },
        gray: {
          DEFAULT: "hsla(34, 6%, 78%, 1)"
        },
        background: {
          DEFAULT: "hsl(50, 13%, 95%)",
        },
        light: {
          DEFAULT: "hsl(0, 0%, 100%)",
        },
        dark: {
          DEFAULT: "hsl(0, 0%, 20%)",
        },
        error: {
          DEFAULT: "hsl(357, 100%, 74%)",
        },
      },
      fontFamily: {
        lexendDeca: ["var(--font-lexend_deca)"],
        lemon: ["var(--font-lemon)"],
      },
      keyframes: {
        dot: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
          '40%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dot": '1.4s ease-in infinite dot',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config

export default config