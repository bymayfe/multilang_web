import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        stats: "1000% 205%",
      },
      backgroundImage: {
        "gradient-spotify": "",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        marquee: "marquee 5s infinite alternate ease-in-out",
        bgStats: "bgStats 20s infinite alternate ease-in-out",
        rotateRing: "rotateRing 6s infinite linear",
        rotateRing2: "rotateRing 4s infinite linear",
        rotateRingReverse: "rotateRingReverse 10s infinite linear",
      },
      keyframes: {
        rotateRing: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        rotateRingReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },

        bgStats: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        marquee: {
          "0%": { transform: "translate(50%, 0)" },
          "100%": { transform: "translate(-100%, 0)" },

          // "0%, 20%": { transform: "translate(0%, 0)" },
          // "80%, 100%": { transform: "translate(-100%, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default nextConfig;
