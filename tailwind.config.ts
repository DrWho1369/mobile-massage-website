import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pearl: "#FCF8F4",
        sand: "#F1E8DC",
        sage: "#B2BDA3",
        peach: "#F8D3BB",
        stone: "#4A4135"
      },
      fontFamily: {
        serifLux: ["var(--font-heading)"],
        sansClean: ["var(--font-body)"]
      },
      boxShadow: {
        "soft-elevated": "0 18px 45px rgba(151, 134, 113, 0.18)",
        "peach-glow": "0 0 0 1px rgba(248, 211, 187, 0.6), 0 18px 40px rgba(248, 211, 187, 0.55)"
      },
      borderRadius: {
        "3xl": "1.75rem"
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(178, 189, 163, 0.4)" },
          "50%": { transform: "scale(1.03)", boxShadow: "0 0 0 14px rgba(178, 189, 163, 0)" }
        }
      },
      animation: {
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
