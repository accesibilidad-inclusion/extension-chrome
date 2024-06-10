<script setup lang="ts">
import { ref, nextTick } from "vue";
import type { PictosStep } from "@/scripts/types";
import { addListener } from "@/scripts/types";
import { state, startRecording, stopRecording } from "@/service-worker";

interface CurrentPositionData {
    x: number;
    y: number;
    elementWidth: number;
    elementHeight: number;
}

interface Step {
    screenshotUrl: string;
    description: string;
    counter: number;
    original: {
        x: number;
        y: number;
        imageWidth: number;
        imageHeight: number;
        elementWidth: number;
        elementHeight: number;
    };
    current?: CurrentPositionData;
}

const steps = ref<Step[]>([]);

addListener((request) => {
    if (request.action === "pictos__add-step" && state.recording) {
        if (request.data.dataUrl) {
            addStep(request.data);
        } else {
            console.error("Error al capturar la imagen");
        }
    }
});

const addStep = (data: PictosStep) => {
    const newStep = {
        screenshotUrl: data.dataUrl,
        counter: steps.value.length + 1,
        description: "Descripción del paso",
        original: {
            x: data.x,
            y: data.y,
            elementWidth: data.elementWidth,
            elementHeight: data.elementHeight,
            imageWidth: data.imageHeight,
            imageHeight: data.imageHeight,
        },
    };

    console.log(newStep);

    steps.value.push(newStep);

    // scroll to the bottom with a smooth animation
    nextTick(() => {
        const container = document.querySelector("#screenshots-container");
        if (container) {
            const lastStep = container.lastElementChild;
            if (lastStep) {
                lastStep.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
};

const clearSteps = () => {
    steps.value = [];
    stopRecording();
};

const onImageLoad = (event: Event, index: number) => {
    const img = event.target as HTMLImageElement;
    const step = steps.value[index];

    step.current = {
        x: (step.original.x * img.clientWidth) / step.original.imageWidth,
        y: (step.original.y * img.clientHeight) / step.original.imageHeight,
        elementWidth: (step.original.elementWidth * img.clientWidth) / step.original.imageWidth,
        elementHeight: (step.original.elementHeight * img.clientHeight) / step.original.imageHeight,
    };
};

const cutoutStyle = (data: CurrentPositionData) => {
    const radius = Math.max(data.elementWidth, data.elementHeight) / 2 + 0.5;
    return {
        "mask-image": `radial-gradient(circle at ${data.x - 15}px ${data.y}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${data.x - 15}px ${data.y}px, transparent ${radius}px, black ${radius}px)`,
    };
};
</script>

<template>
    <div class="p-4 mt-4 text-center">
        <div class="flex flex-col">
            <h4 class="text-xl font-medium">
                {{ steps.length }} {{ steps.length === 1 ? "paso" : "pasos" }}
            </h4>
        </div>
        <ul class="mt-4 flex flex-col gap-6" id="screenshots-container">
            <li v-for="(step, index) in steps" :key="index">
                <p class="text-lg mb-2">Paso {{ step.counter }}</p>
                <p class="mb-4">{{ step.description }}</p>
                <div class="relative">
                    <img
                        :src="step.screenshotUrl"
                        class="w-full h-auto"
                        :alt="step.description"
                        @load="onImageLoad($event, index)"
                    />
                    <div
                        v-if="step.current"
                        class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                        :style="cutoutStyle(step.current)"
                    ></div>
                </div>
            </li>
        </ul>
        <div class="flex gap-4 justify-center">
            <button
                v-if="!state.recording"
                @click="startRecording"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
            >
                Iniciar grabación
            </button>
            <button
                v-if="state.recording"
                @click="stopRecording"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
            >
                Detener grabación
            </button>
            <button
                @click="clearSteps"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
            >
                Limpiar pasos
            </button>
        </div>
    </div>
</template>
