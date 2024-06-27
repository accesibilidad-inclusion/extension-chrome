<script setup lang="ts">
import { watch, onMounted, ref, nextTick } from "vue";
import type { PictosStep, FocusData, Step, Guide } from "@/scripts/types";
import { addListener, sendMessage } from "@/scripts/types";
import { state, startRecording, stopRecording } from "@/service-worker";

const guide = ref<Guide>({
    title: "Mi Guía",
    steps: [],
});

const saveGuideToLocalStorage = () => {
    localStorage.setItem("pictos_guide", JSON.stringify(guide.value));
};

onMounted(() => {
    const savedGuide = localStorage.getItem("pictos_guide");
    if (savedGuide) {
        guide.value = JSON.parse(savedGuide);
    }
});

watch(guide, saveGuideToLocalStorage, { deep: true });

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
    const newStep: Step = {
        screenshotUrl: data.dataUrl,
        counter: guide.value.steps.length + 1,
        screenshotData: data.screenshot,
    };

    console.log(newStep);

    guide.value.steps.push(newStep);

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
    guide.value.steps = [];
    guide.value.title = "Mi Guía";
    localStorage.removeItem("pictos_guide");
    stopRecording();
};

const onImageLoad = (event: Event, index: number) => {
    const img = event.target as HTMLImageElement;
    const step = guide.value.steps[index];

    const naturalX =
        (step.screenshotData.screenX * img.naturalWidth) / step.screenshotData.screenWidth;
    const naturalY =
        (step.screenshotData.screenY * img.naturalHeight) / step.screenshotData.screenHeight;

    const elementNaturalWidth =
        (step.screenshotData.screenElementWidth * img.naturalWidth) /
        step.screenshotData.screenWidth;
    const elementNaturalHeight =
        (step.screenshotData.screenElementHeight * img.naturalHeight) /
        step.screenshotData.screenHeight;

    step.focusData = {
        scaledX: (naturalX * img.width) / img.naturalWidth,
        scaledY: (naturalY * img.height) / img.naturalHeight,
        scaledElementWidth: (elementNaturalWidth * img.width) / img.naturalWidth,
        scaledElementHeight: (elementNaturalHeight * img.height) / img.naturalHeight,
    };

    console.log(`Current Img: ${img.width}, ${img.height}`);
    console.log(`Real Img: ${img.naturalWidth}, ${img.naturalHeight}`);
    console.log(`Screen: ${step.screenshotData.screenWidth}, ${step.screenshotData.screenHeight}`);
    console.log(step.screenshotData);
};

const cutoutStyle = (data: FocusData) => {
    const radius = Math.max(data.scaledElementWidth, data.scaledElementHeight) / 2 + 0.5;
    return {
        "mask-image": `radial-gradient(circle at ${data.scaledX}px ${data.scaledY}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${data.scaledX}px ${data.scaledY}px, transparent ${radius}px, black ${radius}px)`,
    };
};

const openEditor = () => {
    chrome.tabs.create({ url: "index.html" }, (tab) => {
        sendMessage({
            action: "pictos__open-editor",
            data: {
                tabId: tab.id,
                guide: guide.value,
            },
        });
    });
};
</script>

<template>
    <div class="p-4 mt-4 text-center">
        <div class="flex flex-col">
            <h4 class="text-xl font-medium">
                {{ guide.steps.length }} {{ guide.steps.length === 1 ? "paso" : "pasos" }}
            </h4>
        </div>
        <ul class="mt-4 flex flex-col gap-6" id="screenshots-container">
            <li v-for="(step, index) in guide.steps" :key="index">
                <p class="text-lg mb-2">Paso {{ step.counter }}</p>
                <p class="mb-4">{{ step.screenshotData.description }}</p>
                <div class="relative">
                    <img :src="step.screenshotUrl" class="w-full h-auto" :alt="step.screenshotData.description"
                        @load="onImageLoad($event, index)" />
                    <div v-if="step.focusData" class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                        :style="cutoutStyle(step.focusData)"></div>
                </div>
            </li>
        </ul>
        <div class="flex gap-2 justify-center mt-5">
            <button v-if="!state.recording" @click="startRecording"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Iniciar grabación
            </button>
            <button v-if="state.recording" @click="stopRecording"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                Detener grabación
            </button>
            <button @click="openEditor" class="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-900">
                Editar
            </button>
            <button @click="clearSteps" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Limpiar pasos
            </button>
        </div>
    </div>
</template>
