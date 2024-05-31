<script setup lang="ts">
import { ref, nextTick } from "vue";

interface Step {
    screenshotUrl?: string;
    description?: string;
    counter?: number;
}

const recording = ref<boolean>(false);

const steps = ref<Step[]>([]);

const startRecording = () => {
    recording.value = true;
};

const stopRecording = () => {
    recording.value = false;
};

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "addStep" && recording.value) {
        addStep();
    }
});

const addStep = () => {
    chrome.tabs.captureVisibleTab(
        {
            format: "png",
        },
        (dataUrl) => {

            if (dataUrl) {
                const newStep = {
                    screenshotUrl: dataUrl,
                    counter: steps.value.length + 1,
                    description: "Descripción del paso"
                }

                steps.value.push(newStep);

                // scroll to the bottom with a smooth animation
                nextTick(() => {
                    const container = document.querySelector('#screenshots-container');
                    if (container) {
                        const lastStep = container.lastElementChild;
                        if (lastStep) {
                            lastStep.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }
            else {
                console.error("Error al capturar la imagen");
            }

        },
    );
};

const clearSteps = () => {
    steps.value = [];
    stopRecording();
};

</script>

<template>
    <div class="h-full">
        <div v-if="recording" class="p-4 mt-4 text-center">
            <div class="flex flex-col">
                <h4 class="text-xl font-medium">{{ steps.length }} {{ steps.length === 1 ? 'paso' :
                    'pasos' }}</h4>
            </div>
            <ul class="mt-4 flex flex-col gap-6" id="screenshots-container">
                <li v-for="(step, index) in steps" :key="index">
                    <p class="text-lg mb-4">
                        Paso {{ step.counter }}
                    </p>
                    <img :src="step.screenshotUrl" class="w-full h-auto" />
                </li>
            </ul>
        </div>
        <iframe v-else title="pictos-frame" id="pictos-frame" src="https://app.pictos.cl/inicio?view=embed" width="100%"
            height="100%" class="border-0 m-0">
        </iframe>
        <div class="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-center space-x-4">
            <button v-show="!recording" @click="startRecording"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-1">
                Grabar
            </button>
            <button v-show="recording" @click="stopRecording"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex-1">
                Detener
            </button>
            <button v-show="recording" @click="clearSteps"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex-1">
                Cancelar
            </button>
        </div>
    </div>
</template>