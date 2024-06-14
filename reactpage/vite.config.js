import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  server: {
    port: 8000,
    proxy: {
      "/api": {
        target: "http://backend:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/"),
      },
      // "/api": "http://127.0.0.1:5000",
    },
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        capitalschedule: resolve(root, "capitalschedule/index.html"),
        cashflowschedule: resolve(root, "cashflowschedule/index.html"),
        feeschedule: resolve(root, "feeschedule/index.html"),
        builder: resolve(root, "builder/index.html"),
      },
      output: {
        // Ensure the correct path structure is maintained
        entryFileNames: "[name]/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
