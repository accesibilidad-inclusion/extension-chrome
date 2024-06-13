import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import RecordingView from "@/views/RecordingView.vue";
import EditorView from "@/views/EditorView.vue";

const routes = [
    { path: "/", name: "HomeView", component: HomeView },
    { path: "/recording", name: "RecordingView", component: RecordingView },
    { path: "/editor", name: "EditorView", component: EditorView },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;
