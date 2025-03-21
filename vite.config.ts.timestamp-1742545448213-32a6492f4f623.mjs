// vite.config.ts
import tailwindcss from "file:///D:/projects/BW_FE_Application/node_modules/tailwindcss/lib/index.js";
import { defineConfig } from "file:///D:/projects/BW_FE_Application/node_modules/vite/dist/node/index.js";
import react from "file:///D:/projects/BW_FE_Application/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@emotion/react": "@emotion/react",
      "@emotion/styled": "@emotion/styled"
    }
  },
  base: "/",
  server: {
    port: 3e3,
    allowedHosts: ["uatapp.botwot.io", "app.botwot.io"]
  },
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  build: {
    outDir: "dist"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxCV19GRV9BcHBsaWNhdGlvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdHNcXFxcQldfRkVfQXBwbGljYXRpb25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3RzL0JXX0ZFX0FwcGxpY2F0aW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBlbW90aW9uL3JlYWN0XCI6IFwiQGVtb3Rpb24vcmVhY3RcIixcclxuICAgICAgXCJAZW1vdGlvbi9zdHlsZWRcIjogXCJAZW1vdGlvbi9zdHlsZWRcIixcclxuICAgIH0sXHJcbiAgfSxcclxuICBiYXNlOiBcIi9cIixcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBhbGxvd2VkSG9zdHM6IFtcInVhdGFwcC5ib3R3b3QuaW9cIiAsIFwiYXBwLmJvdHdvdC5pb1wiXSxcclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgcG9zdGNzczoge1xyXG4gICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MoKV0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogXCJkaXN0XCIsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsT0FBTyxpQkFBaUI7QUFDdlMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxrQkFBa0I7QUFBQSxNQUNsQixtQkFBbUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWMsQ0FBQyxvQkFBcUIsZUFBZTtBQUFBLEVBQ3JEO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
