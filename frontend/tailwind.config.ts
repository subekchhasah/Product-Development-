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
          dark: "#08090e", // Deep space dark background
          card: "#0f111a", // Dark card background
          border: "#181a25", // Dark border color
          primary: "#a855f7", // ITactics Neon Purple
          secondary: "#06b6d4", // Electric Cyan
          purple: "#ec4899", // Neon Pink
          muted: "#94a3b8", // Cool slate grey
          charcoal: "#f8fafc" // High-contrast white/slate text
        }
      },
    },
  },
  plugins: [],
};
export default config;
