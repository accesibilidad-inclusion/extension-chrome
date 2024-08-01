<template>
    <main>
        <div class="h-full mb-[0px]">
            <RouterView />
        </div>
    </main>
    <div
        v-if="$route.path === '/'"
        class="fixed z-[0] bg-yellow bottom-0 left-0 w-full shadow-lg p-4 flex justify-center items-center space-x-4"
    >
        <!-- <router-link
            v-if="$route.path === '/recording'"
            to="/"
            class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full text-center font-medium"
        >
            {{ getMessage("backToHome") }}
        </router-link> -->
        <router-link
            to="/tutorial"
            class="fixed bottom-5 right-4 flex items-center bg-white shadow-lg rounded-full border border-black"
        >
            <div class="p-2 flex items-center justify-center mr-2">
                <img src="../public/assets/img/video.svg" />
            </div>
            <span class="font-medium" style="margin-right: 25px">
                {{ getMessage("goToRecordInterface") }}
            </span>
        </router-link>
    </div>

    <!-- Espacio adicional -->
    <div v-if="$route.path === '/'" class="extra-space"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { addListener, getMessage } from "@/utils/chrome-utils";

const router = useRouter();

onMounted(() => {
    addListener((request) => {
        if (request.action === "NAVIGATE_TO_EDITOR") {
            router.push("/editor");
        }
    });
});
</script>

<style>
.extra-space {
    background-color: #f6c254; /* Para que coincida con el color de fondo de la página */
    height: 75px; /* Comienza con 0px de altura */
}

.bg-yellow {
    background-color: #f6c254;
    border-radius: 10px 10px 0 0;
}

.bg-blue-dark {
    background-color: #041c42;
}
</style>
