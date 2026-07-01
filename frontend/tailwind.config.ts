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
          dark: "#060814", // Blue-tinted deep obsidian
          card: "#0b0f24", // Deep blue-tinted card container
          border: "#171e3d", // Deep blue-tinted border
          primary: "#3b82f6", // Neurox Vibrant Royal Blue
          secondary: "#8b5cf6", // Neurox Tech Violet
          purple: "#ec4899", // Neurox Pink/Rose
          muted: "#94a3b8", // Cool slate grey text
          charcoal: "#f8fafc" // High-contrast white/slate text
        }
      },
    },
  },
  plugins: [],
};
export default config;
