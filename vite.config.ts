import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import typedSwPlugin from "vite-plugin-typed-sw";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid({ start: true, diagnostics: true }),
    Icons({ compiler: "solid" }),
    typedSwPlugin(),
  ],
  server: {
    port: 4321,
    allowedHosts: ["dev.lzart.com.br"],
    forwardConsole: true,
  },
  build: {
    target: "esnext",
    reportCompressedSize: false,
  },
});
