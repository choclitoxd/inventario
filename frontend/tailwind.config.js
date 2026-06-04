/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Path to Tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        neonGreen: "#39FF14",
        neonCyan: "#00E5FF",
        carbon: {
          950: "#0B0B0C",
          900: "#121214",
          800: "#1A1A1E",
          700: "#26262B",
          600: "#32323A",
          500: "#494954",
        },
        tremor: {
          brand: {
            faint: "#0B0B0C",
            muted: "#32323A",
            subtle: "#00E5FF",
            DEFAULT: "#39FF14",
            emphasis: "#39FF14",
          },
          background: {
            muted: "#121214",
            subtle: "#1A1A1E",
            DEFAULT: "#121214",
            emphasis: "#26262B",
          },
          border: {
            DEFAULT: "#26262B",
          },
          content: {
            subtle: "#494954",
            DEFAULT: "#E4E4E7",
            emphasis: "#FFFFFF",
            strong: "#FFFFFF",
          },
        },
      },
      fontFamily: {
        sports: ["Outfit", "sans-serif"],
        body: ["Barlow", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 15px rgba(57, 255, 20, 0.2)",
        "neon-cyan": "0 0 15px rgba(0, 229, 255, 0.2)",
        "neon-green-intense": "0 0 25px rgba(57, 255, 20, 0.45)",
      },
    },
  },
  plugins: [],
}
