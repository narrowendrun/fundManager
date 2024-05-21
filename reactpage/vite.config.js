import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5000/",
    },
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
