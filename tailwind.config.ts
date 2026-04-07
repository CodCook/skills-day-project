import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B3A6B",
        gold: "#C8973A",
        surface: "#F8F7F4", // Updated from background to surface
        background: "#F8F7F4",
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.glass': {
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'background-color': 'rgba(255, 255, 255, 0.7)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        }
      })
    }
  ],
};
export default config;
