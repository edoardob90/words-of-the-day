// @ts-check
import { defineConfig, memoryCache } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import db from "@astrojs/db";
import clerk from "@clerk/astro";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
  integrations: [db(), clerk()],
  experimental: {
    cache: {
      provider: memoryCache(),
    },
    routeRules: {
      "/": { maxAge: 86400, swr: 86400, tags: ["words"] },
      "/[word]": { maxAge: 86400, swr: 86400, tags: ["words"] },
      "/api/export.json": { maxAge: 86400, swr: 86400, tags: ["words"] },
    },
  },
  output: "server",
});
