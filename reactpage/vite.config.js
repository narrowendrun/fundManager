import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
// https://vitejs.dev/config/
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
        capitalschedule: resolve(root, "capitalschedule", "index.html"),
        cashflowschedule: resolve(root, "cashflowschedule", "index.html"),
      },
    },
  },
});
