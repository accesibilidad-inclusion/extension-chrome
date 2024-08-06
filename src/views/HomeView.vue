<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getMessage, getShowTutorial } from "@/utils/chrome-utils";

const showTutorial = ref(false);

onMounted(() => {
    getShowTutorial().then((value) => {
        showTutorial.value = value;
    });
});
</script>

<template>
    <iframe
        title="pictos-frame"
        id="pictos-frame"
        src="https://app.pictos.cl/inicio?view=embed"
        width="100%"
        height="100%"
        class="border-0 m-0 h-[calc(100vh)]"
    >
    </iframe>
    <div class="extra-space"></div>
    <div
        class="fixed z-[0] bg-yellow bottom-0 left-0 w-full shadow-lg p-4 flex justify-center items-center space-x-4"
    >
        <router-link
            v-if="showTutorial"
            to="/tutorial"
            class="fixed bottom-5 right-4 flex items-center bg-white shadow-lg rounded-full border border-black"
        >
            <div class="p-2 flex items-center justify-center mr-2">
                <img src="/assets/img/video.svg" />
            </div>
            <span class="font-medium" style="margin-right: 25px">
                {{ getMessage("goToRecordInterface") }}
            </span>
        </router-link>
        <router-link
            v-else
            to="/recording"
            class="fixed bottom-5 right-4 flex items-center bg-white shadow-lg rounded-full border border-black"
        >
            <div class="p-2 flex items-center justify-center mr-2">
                <img src="/assets/img/video.svg" />
            </div>
            <span class="font-medium" style="margin-right: 25px">
                {{ getMessage("goToRecordInterface") }}
            </span>
        </router-link>
    </div>
</template>

<style scoped>
.extra-space {
    background-color: #f6c254; /* Para que coincida con el color de fondo de la página */
    height: 75px; /* Comienza con 0px de altura */
}
</style>
