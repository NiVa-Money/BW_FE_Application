import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@emotion/react": "@emotion/react",
      "@emotion/styled": "@emotion/styled",
    },
  },
  base: "/",
  server: {
    port: 3000,
    allowedHosts: ["uatapp.botwot.io", "app.botwot.io"],
    watch: {
      ignored: ["**/.git/**"],
    },
    hmr: {
      overlay: false, 
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: "dist",
  },
});
