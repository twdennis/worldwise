import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import esint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    esint({
      overrideConfig: {
        rules: {
          "no-unused-vars": "warn",
        },
      },
    }),
  ],
});
