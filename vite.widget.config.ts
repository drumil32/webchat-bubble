import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Separate Vite config for building the embeddable widget
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget-build.ts"),
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["iife"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        inlineDynamicImports: true,
      },
    },
    outDir: "dist-widget",
    emptyOutDir: true,
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});