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
        brand: {
          dark: "#faf6f5", // Warm light grey/white
          card: "#ffffff", // Pure white for cards
          border: "#f0e4e2", // Very soft pinkish border
          primary: "#ec4899", // Vibrant Pink
          secondary: "#06b6d4", // Sky Blue
          purple: "#a855f7", // Soft Violet/Purple
          muted: "#6b7280", // Gray text
          charcoal: "#1e1f29" // Dark text
        }
      },
    },
  },
  plugins: [],
};
export default config;
