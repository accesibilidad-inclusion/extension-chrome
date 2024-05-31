import "@/styles/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import "@/scripts/sidepanel";
import "@/scripts/overlay";
import router from '@/router'

createApp(App).use(router).mount("#app");

