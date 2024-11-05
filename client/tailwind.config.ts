import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'dot-flashing': 'dotFlashing 0.6s infinite alternate', // Define the custom animation keyframes and timing
      },
      keyframes: {
        dotFlashing: {
          '0%, 100%': { transform: 'scale(0.8)', backgroundColor: '#cbd5e1' }, // Tailwind color scale
          '50%': { transform: 'scale(1.2)', backgroundColor: '#64748b' }, // Tailwind color scale
        }
      }
    },
  },
  plugins: [],
};
export default config;
