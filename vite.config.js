import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on LAN so you can test WebAR on a phone
    port: 5173,
    proxy: {
      // Forwards /api/* to the Express server started by `npm run server`,
      // so `npm run dev:full` gives you frontend + backend on one origin.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0, // keep .glb / .mp3 as separate files, never base64-inlined
  },
});
