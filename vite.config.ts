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
    host: true,
    allowedHosts: ["uatapp.botwot.io", "app.botwot.io"],
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ["**/.git/**"],
    },
    hmr: {
      protocol: "ws",
      port: 24678,
      clientPort: 24678, // Map to Docker port
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
