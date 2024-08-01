<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addListener } from "@/utils/chrome-utils";

const router = useRouter();
const isFloatingButtonVisible = ref(true);

addListener((request) => {
    if (request.action === "NAVIGATE_TO_EDITOR") {
        router.push("/editor");
    }
});

const handleFloatingButtonClick = () => {
    isFloatingButtonVisible.value = false;
};

/*const handleRecordingButtonClick = () => {
    router.push("/recording");
};*/
const handleRecordingButtonClick = () => {
    router.push("/tutorial");
};
</script>

<template>
    <div class="h-full relative">
        <main>
            <div class="h-full mb-[70px]">
                <RouterView />
            </div>
        </main>

        <button
            v-if="isFloatingButtonVisible"
            @click="handleFloatingButtonClick"
            class="fixed bottom-4 right-4 flex items-center bg-white shadow-lg rounded-full p-2 border border-black z-30"
        >
            <div class="p-2 flex items-center justify-center mr-2">
                <!-- SVG Icon Here -->
                <img src="../public/assets/img/video.svg" />
            </div>
            <span class="font-medium" style="margin-right: 25px">Crear apoyo</span>
        </button>

        <div
            style="
                background-color: #f6c254;
                font-size: 15px;
                box-shadow:
                    0 -6px 6px -1px rgba(0, 0, 0, 0.1),
                    0 -2px 4px -2px rgba(0, 0, 0, 0.1);
            "
            v-else
            class="fixed z-[20] bottom-0 left-0 w-full bg-white p-4 flex justify-center items-center space-x-4 h-[70px]"
        >
            <router-link
                v-if="$route.path === '/'"
                to="/elementos"
                @click="handleRecordingButtonClick"
            >
                Crear nuevo apoyo
            </router-link>
            <router-link
                v-if="$route.path === '/elementos'"
                to="/"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full text-center font-medium"
            >
                Volver a inicio
            </router-link>
        </div>
    </div>
</template>

<style scoped>
/* Asegúrate de que no haya un fondo blanco en el contenedor principal */
.h-full {
    background-color: #fada98;
}
</style>
