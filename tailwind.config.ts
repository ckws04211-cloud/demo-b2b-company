import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 50: "#f4f6f8", 100: "#e6eaef", 300: "#aab4c0", 500: "#5b6878", 700: "#2a3442", 800: "#1b222c", 900: "#11161d" },
        signal: { 500: "#0a5cff", 600: "#0048d6", 50: "#eef4ff" },
      },
      fontFamily: { sans: ["Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "sans-serif"] },
      maxWidth: { content: "1240px" },
    },
  },
  plugins: [],
} satisfies Config;
