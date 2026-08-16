import { relative, sep } from "node:path";

import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
        runes: ({ filename }) => {
          const relativePath = relative(import.meta.dirname, filename);
          const pathSegments = relativePath.toLowerCase().split(sep);
          const isExternalLibrary = pathSegments.includes("node_modules");

          return isExternalLibrary ? undefined : true;
        },
        modernAst: true,
        experimental: {
          async: true,
        },
      },
      adapter: adapter({
        fallback: "404.html"
      }),
      version: {
        pollInterval: 0,
      },
    }),
    Icons({ compiler: "svelte" }),
  ],
  build: {
    target: "esnext",
    reportCompressedSize: false,
  },
  server: {
    port: 4321,
    allowedHosts: ["dev.lzart.com.br"],
  },
});
