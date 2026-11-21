import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In dev, "/api/*" goes to a locally running backend (dance_district on port 4044),
    // mirroring production where nginx proxies /api to Node.
    proxy: {
      "/api": "http://localhost:4044",
    },
  },
});
