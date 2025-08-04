import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": process.env,
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            redux: ["redux", "react-redux", "@reduxjs/toolkit"],
            socket: ["socket.io-client"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
