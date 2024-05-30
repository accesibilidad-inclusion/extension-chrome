// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/nivek/Dev/web/PICTOS/extension-chrome/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/nivek/Dev/web/PICTOS/extension-chrome/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/nivek/Dev/web/PICTOS/extension-chrome/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { crx } from "file:///C:/Users/nivek/Dev/web/PICTOS/extension-chrome/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  default_locale: "es",
  name: "__MSG_extensionName__",
  description: "__MSG_extensionDescription__",
  version: "0.2.0",
  icons: {
    "128": "assets/img/icon128.png",
    "48": "assets/img/icon48.png",
    "32": "assets/img/icon32.png",
    "16": "assets/img/icon16.png"
  },
  homepage_url: "https://www.pictos.cl/",
  action: {
    default_title: "__MSG_extensionActionDefaultTitle__",
    default_icon: "assets/img/extension-icon.png"
  },
  web_accessible_resources: [
    {
      resources: [
        "assets/open-sans-latin-700-normal.woff2"
      ],
      matches: [
        "*://*/*"
      ]
    }
  ],
  permissions: [
    "sidePanel",
    "tabs",
    "activeTab"
  ],
  side_panel: {
    default_path: "index.html"
  },
  background: {
    service_worker: "src/service-worker.ts"
  },
  content_scripts: [
    {
      matches: [
        "<all_urls>"
      ],
      js: [
        "src/scripts/content.ts",
        "src/scripts/sidepanel.ts",
        "src/scripts/check-available-aids.ts"
      ],
      css: [
        "assets/styles/overlay.css"
      ]
    }
  ]
};

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///C:/Users/nivek/Dev/web/PICTOS/extension-chrome/vite.config.ts";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  plugins: [vue(), vueJsx(), crx({ manifest: manifest_default })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5pdmVrXFxcXERldlxcXFx3ZWJcXFxcUElDVE9TXFxcXGV4dGVuc2lvbi1jaHJvbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5pdmVrXFxcXERldlxcXFx3ZWJcXFxcUElDVE9TXFxcXGV4dGVuc2lvbi1jaHJvbWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL25pdmVrL0Rldi93ZWIvUElDVE9TL2V4dGVuc2lvbi1jaHJvbWUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xuXG5pbXBvcnQgeyBjcnggfSBmcm9tIFwiQGNyeGpzL3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3QuanNvblwiIGFzc2VydCB7IHR5cGU6IFwianNvblwiIH07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFt2dWUoKSwgdnVlSnN4KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcbn0pO1xuIiwgIntcclxuICAgIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxyXG4gICAgXCJkZWZhdWx0X2xvY2FsZVwiOiBcImVzXCIsXHJcbiAgICBcIm5hbWVcIjogXCJfX01TR19leHRlbnNpb25OYW1lX19cIixcclxuICAgIFwiZGVzY3JpcHRpb25cIjogXCJfX01TR19leHRlbnNpb25EZXNjcmlwdGlvbl9fXCIsXHJcbiAgICBcInZlcnNpb25cIjogXCIwLjIuMFwiLFxyXG4gICAgXCJpY29uc1wiOiB7XHJcbiAgICAgICAgXCIxMjhcIjogXCJhc3NldHMvaW1nL2ljb24xMjgucG5nXCIsXHJcbiAgICAgICAgXCI0OFwiOiBcImFzc2V0cy9pbWcvaWNvbjQ4LnBuZ1wiLFxyXG4gICAgICAgIFwiMzJcIjogXCJhc3NldHMvaW1nL2ljb24zMi5wbmdcIixcclxuICAgICAgICBcIjE2XCI6IFwiYXNzZXRzL2ltZy9pY29uMTYucG5nXCJcclxuICAgIH0sXHJcbiAgICBcImhvbWVwYWdlX3VybFwiOiBcImh0dHBzOi8vd3d3LnBpY3Rvcy5jbC9cIixcclxuICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICBcImRlZmF1bHRfdGl0bGVcIjogXCJfX01TR19leHRlbnNpb25BY3Rpb25EZWZhdWx0VGl0bGVfX1wiLFxyXG4gICAgICAgIFwiZGVmYXVsdF9pY29uXCI6IFwiYXNzZXRzL2ltZy9leHRlbnNpb24taWNvbi5wbmdcIlxyXG4gICAgfSxcclxuICAgIFwid2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwicmVzb3VyY2VzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiYXNzZXRzL29wZW4tc2Fucy1sYXRpbi03MDAtbm9ybWFsLndvZmYyXCJcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJtYXRjaGVzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiKjovLyovKlwiXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgXCJwZXJtaXNzaW9uc1wiOiBbXHJcbiAgICAgICAgXCJzaWRlUGFuZWxcIixcclxuICAgICAgICBcInRhYnNcIixcclxuICAgICAgICBcImFjdGl2ZVRhYlwiXHJcbiAgICBdLFxyXG4gICAgXCJzaWRlX3BhbmVsXCI6IHtcclxuICAgICAgICBcImRlZmF1bHRfcGF0aFwiOiBcImluZGV4Lmh0bWxcIlxyXG4gICAgfSxcclxuICAgIFwiYmFja2dyb3VuZFwiOiB7XHJcbiAgICAgICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9zZXJ2aWNlLXdvcmtlci50c1wiXHJcbiAgICB9LFxyXG4gICAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJtYXRjaGVzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiPGFsbF91cmxzPlwiXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFwianNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCJzcmMvc2NyaXB0cy9jb250ZW50LnRzXCIsXHJcbiAgICAgICAgICAgICAgICBcInNyYy9zY3JpcHRzL3NpZGVwYW5lbC50c1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzcmMvc2NyaXB0cy9jaGVjay1hdmFpbGFibGUtYWlkcy50c1wiXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFwiY3NzXCI6IFtcclxuICAgICAgICAgICAgICAgIFwiYXNzZXRzL3N0eWxlcy9vdmVybGF5LmNzc1wiXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwVSxTQUFTLGVBQWUsV0FBVztBQUU3VyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBRW5CLFNBQVMsV0FBVzs7O0FDTnBCO0FBQUEsRUFDSSxrQkFBb0I7QUFBQSxFQUNwQixnQkFBa0I7QUFBQSxFQUNsQixNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxPQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDVjtBQUFBLEVBQ0EsY0FBZ0I7QUFBQSxFQUNoQixRQUFVO0FBQUEsSUFDTixlQUFpQjtBQUFBLElBQ2pCLGNBQWdCO0FBQUEsRUFDcEI7QUFBQSxFQUNBLDBCQUE0QjtBQUFBLElBQ3hCO0FBQUEsTUFDSSxXQUFhO0FBQUEsUUFDVDtBQUFBLE1BQ0o7QUFBQSxNQUNBLFNBQVc7QUFBQSxRQUNQO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxhQUFlO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1YsY0FBZ0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1YsZ0JBQWtCO0FBQUEsRUFDdEI7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2Y7QUFBQSxNQUNJLFNBQVc7QUFBQSxRQUNQO0FBQUEsTUFDSjtBQUFBLE1BQ0EsSUFBTTtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxNQUNBLEtBQU87QUFBQSxRQUNIO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7OztBRHJEaU4sSUFBTSwyQ0FBMkM7QUFVbFEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN4RDtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksRUFBRSwyQkFBUyxDQUFDLENBQUM7QUFDaEQsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
