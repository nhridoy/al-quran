import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig, loadEnv, createFilter, transformWithOxc } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
