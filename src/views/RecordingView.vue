<script setup lang="ts">
import { watch, onMounted, ref, nextTick } from "vue";
import type { AddStepData, FocusData, Step, Guide } from "@/scripts/types";
import { addListener, sendMessage, getMessage } from "@/scripts/types";
import { state, startRecording, stopRecording } from "@/service-worker";

const guide = ref<Guide>({
    title: getMessage("taskDefaultName"),
    steps: [],
});

const images = ref<HTMLImageElement[]>([]);

const saveGuideToLocalStorage = () => {
    localStorage.setItem("pictos_guide", JSON.stringify(guide.value));
};
watch(() => JSON.parse(JSON.stringify(guide.value)), saveGuideToLocalStorage, { deep: true });

onMounted(() => {
    const savedGuide = localStorage.getItem("pictos_guide");
    if (savedGuide) {
        guide.value = JSON.parse(savedGuide);
    }

    addListener((request) => {
        if (request.action === "ADD_STEP" && state.recording) {
            addStep(request.data);
        }
    });
});

watch(guide, saveGuideToLocalStorage, { deep: true });

const addStep = (data: AddStepData) => {
    const newStep: Step = {
        screenshotUrl: data.dataUrl,
        counter: guide.value.steps.length + 1,
        screenshotData: data.screenshotData,
        title: data.title,
        description: "",
        elementType: data.elementType,
        focusData: {
            x: 0,
            y: 0,
            radius: 0,
        },
        actionUrl: data.actionUrl,
        pictogram: null,
    };

    guide.value.steps.push(newStep);

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
    guide.value.title = getMessage("taskDefaultName");
    localStorage.removeItem("pictos_guide");
    stopRecording();
};

const onImageLoad = (event: Event, index: number) => {
    images.value[index] = event.target as HTMLImageElement;

    const step = guide.value.steps[index];

    let radius = 0;
    if (step.screenshotData.screenElementWidth >= step.screenshotData.screenElementHeight) {
        radius =
            ((step.screenshotData.screenElementWidth / 2) * 100) /
            (step.screenshotData.screenWidth / 2);
    } else {
        radius =
            ((step.screenshotData.screenElementHeight / 2) * 100) /
            (step.screenshotData.screenHeight / 2);
    }

    step.focusData = {
        x: (step.screenshotData.screenX * 100) / step.screenshotData.screenWidth,
        y: (step.screenshotData.screenY * 100) / step.screenshotData.screenHeight,
        radius: radius + 5,
    };
};

const cutoutStyle = (data: FocusData, index: number) => {
    if (!data || data.radius <= 0 || index >= images.value.length) return {};

    const img = images.value[index];

    const x = (data.x * img.width) / 100;
    const y = (data.y * img.height) / 100;

    let radius = 0;
    if (img.width >= img.height) {
        radius = (data.radius * (img.width / 2)) / 100;
    } else {
        radius = (data.radius * (img.height / 2)) / 100;
    }

    return {
        "mask-image": `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`,
    };
};

const openEditor = () => {
    chrome.tabs.create({ url: "index.html" }, (tab) => {
        sendMessage({
            action: "OPEN_EDITOR",
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
            <h4 class="text-2xl font-medium">
                {{ guide.steps.length }}
                {{ guide.steps.length === 1 ? getMessage("step") : getMessage("steps") }}
            </h4>
        </div>
        <ul class="mt-4 flex flex-col gap-6" id="screenshots-container">
            <li v-for="(step, index) in guide.steps" :key="index">
                <p class="text-xl mb-2">
                    {{ `${getMessage("step").toUpperCase()} ${step.counter}` }}
                </p>
                <p class="text-lg font-semibold mb-2">{{ step.title }}</p>
                <p class="mb-2">{{ step.description }}</p>
                <div>
                    <p v-if="step.actionUrl" class="mb-4 text-sm text-blue-600">
                        <a :href="step.actionUrl" target="_blank">{{ step.actionUrl }}</a>
                    </p>
                    <p v-else class="mb-4 text-sm text-red-600">
                        {{ getMessage("stepNoUrlMessage") }}
                    </p>
                </div>
                <div class="relative">
                    <img
                        :src="step.screenshotUrl"
                        class="w-full h-auto"
                        :alt="step.description"
                        @load="onImageLoad($event, index)"
                    />
                    <div
                        v-if="step.focusData.radius > 0"
                        class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                        :style="cutoutStyle(step.focusData, index)"
                    ></div>
                </div>
            </li>
        </ul>
        <div class="flex gap-2 justify-center mt-5">
            <button
                v-if="!state.recording"
                @click="startRecording"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
                {{ getMessage("startRecording") }}
            </button>
            <button
                v-if="state.recording"
                @click="stopRecording"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
                {{ getMessage("stopRecording") }}
            </button>
            <button
                @click="openEditor"
                class="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-900"
            >
                {{ getMessage("openEditor") }}
            </button>
            <button
                @click="clearSteps"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                {{ getMessage("clearSteps") }}
            </button>
        </div>
    </div>
</template>
