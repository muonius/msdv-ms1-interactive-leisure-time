import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  base: "msdv-ms1-interactive-leisure-time/",
  plugins: [svelte()],
});
