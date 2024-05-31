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
    <div class="p-4 mt-4 text-center">
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
        <div class="flex gap-4 justify-center">
            <button v-if="!recording" @click="startRecording"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4">
                Iniciar grabación
            </button>
            <button v-if="recording" @click="stopRecording"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4">
                Detener grabación
            </button>
            <button @click="clearSteps" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">
                Limpiar pasos
            </button>
        </div>
    </div>
</template>