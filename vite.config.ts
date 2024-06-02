import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" assert { type: "json" };

import hotReloadExtension from "hot-reload-extension-vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    plugins: [
        vue(),
        vueJsx(),
        crx({ manifest }),
        hotReloadExtension({
            log: true,
            backgroundPath: "src/service-worker.ts",
        }),
    ],
});
