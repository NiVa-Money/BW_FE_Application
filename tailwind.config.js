/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      helperText: {
        paddingLeft: '0rem', // Equivalent to text-sm
         // Equivalent to mt-1
      },
    },
  },
  plugins: [],
};
