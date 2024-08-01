import { createMemoryHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RecordingView from "@/views/RecordingView.vue";
import EditorView from "@/views/EditorView.vue";
import TutorialView from "@/views/TutorialView.vue";
import AgregarView from "@/views/AgregarView.vue";
import GrabarView from "./views/GrabarView.vue";
import PrevisualizarView from "./views/PrevisualizarView.vue";
import ElementosView from "./views/ElementosView.vue";

const routes = [
    { path: "/", name: "HomeView", component: HomeView },
    { path: "/recording", name: "RecordingView", component: RecordingView },
    { path: "/editor", name: "EditorView", component: EditorView },
    {
        path: '/tutorial',
        name: 'Tutorial',
        component: TutorialView
    },
    {
        path: '/agregar',
        name: 'Agregar',
        component: AgregarView
    },
    {
        path: '/grabar',
        name: 'Grabar',
        component: GrabarView,
        props: (route: { query: { taskName: any; }; }) => ({ taskName: route.query.taskName })    
    },
    {
        path: '/previsualizar',
        name: 'Previsualizar',
        component: PrevisualizarView,
        props: (route: { query: { taskName: any; }; }) => ({ taskName: route.query.taskName })    
    },
    {
        path: '/elementos',
        name: 'Elementos',
        component: ElementosView,
        props: (route: { query: { taskName: any; }; }) => ({ taskName: route.query.taskName })    
    }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


export default router;
