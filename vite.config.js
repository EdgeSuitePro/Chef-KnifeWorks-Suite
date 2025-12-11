import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // A library-style build so Wix gets a single JS file
    lib: {
      entry: "src/main-wix-elements.jsx",
      name: "CKWElements",
      formats: ["es"],
      fileName: () => "ckw-elements.js",
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
      }
    }
  }
});
