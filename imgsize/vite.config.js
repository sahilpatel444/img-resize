import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",

  build: {
    chunkSizeWarningLimit: 1500, // Set to a higher value (in KB)
    // rollupOptions: {

    //   external: ["@headlessui/react"],

    // },
  },
});
