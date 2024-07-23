<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import type { Guide, Step, FocusData } from "@/scripts/types";
import jsPDF from "jspdf";

const guide = ref<Guide>({
    title: "Mi Guía",
    steps: [],
});

const isEditing = ref(false);
const currentFocusStep = ref<number | null>(null);

const saveGuideToLocalStorage = () => {
    localStorage.setItem("pictos_guide", JSON.stringify(guide.value));
};

const editGuideTitle = (newTitle: string) => {
    guide.value.title = newTitle;
    saveGuideToLocalStorage();
};

const editStepTitle = (index: number, newTitle: string) => {
    if (guide.value.steps[index]) {
        guide.value.steps[index].title = newTitle;
        saveGuideToLocalStorage();
    }
};

const editDescription = (index: number, newDescription: string) => {
    if (guide.value.steps[index]) {
        guide.value.steps[index].description = newDescription;
        saveGuideToLocalStorage();
    }
};

const addStep = () => {
    guide.value.steps.push({
        title: 'Nuevo Paso',
        description: '',
        elementType: '',
        screenshotUrl: '',
        counter: guide.value.steps.length + 1,
        screenshotData: {
            screenX: 0,
            screenY: 0,
            screenElementWidth: 0,
            screenElementHeight: 0,
            screenWidth: 0,
            screenHeight: 0,
        },
        focusData: {
            scaledX: 0,
            scaledY: 0,
            scaledElementWidth: 0,
            scaledElementHeight: 0,
        },
        actionUrl: '', // Nuevo campo para almacenar la URL de la acción
    });
    saveGuideToLocalStorage();
};

const removeStep = (index: number) => {
    guide.value.steps.splice(index, 1);
    saveGuideToLocalStorage();
};

const uploadImage = (event: Event, index: number) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (guide.value.steps[index]) {
                const img = new Image();
                img.onload = () => {
                    guide.value.steps[index].screenshotData.screenElementWidth = img.width;
                    guide.value.steps[index].screenshotData.screenElementHeight = img.height;
                    guide.value.steps[index].screenshotUrl = e.target?.result as string;
                    guide.value.steps[index].screenshotData.screenWidth = img.width;
                    guide.value.steps[index].screenshotData.screenHeight = img.height;
                    saveGuideToLocalStorage();
                };
                img.src = e.target?.result as string;
            }
        };
        reader.readAsDataURL(file);
    }
};

const editActionUrl = (index: number, url: string) => {
    if (guide.value.steps[index]) {
        guide.value.steps[index].actionUrl = url;
        saveGuideToLocalStorage();
    }
};

onMounted(() => {
    const savedGuide = localStorage.getItem("pictos_guide");
    if (savedGuide) {
        guide.value = JSON.parse(savedGuide);
    }
});




watch(guide, saveGuideToLocalStorage, { deep: true });

const downloadGuide = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // Add title to the PDF
    pdf.setFontSize(24);
    pdf.text(guide.value.title, 20, 20);

    let yOffset = 40;

    for (const step of guide.value.steps) {

        pdf.setFontSize(16);
        pdf.text(`Paso ${step.counter}: ${step.title}`, 20, yOffset);

        yOffset += 10;

        // Add description
        pdf.setFontSize(12);
        const descriptionLines = pdf.splitTextToSize(step.description, 170);
        pdf.text(descriptionLines, 20, yOffset);
        yOffset += 10 * descriptionLines.length;

        // Add screenshot
        const imgWidth = 170;
        const imgHeight = (170 * 9) / 16; // Assuming 16:9 aspect ratio, adjust if needed

        if (yOffset + imgHeight > 280) {
            pdf.addPage();
            yOffset = 20;
        }

        pdf.addImage(step.screenshotUrl, "PNG", 20, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 20;

        if (yOffset > 250) {
            pdf.addPage();
            yOffset = 20;
        }
    }

    pdf.save(`${guide.value.title}.pdf`);
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
};

const cutoutStyle = (data: FocusData) => {
    const radius = Math.max(data.scaledElementWidth, data.scaledElementHeight) / 2 + 0.5;
    return {
        "mask-image": `radial-gradient(circle at ${data.scaledX}px ${data.scaledY}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${data.scaledX}px ${data.scaledY}px, transparent ${radius}px, black ${radius}px)`,
    };
};



</script>


<template>
    <div class="max-w-2xl mx-auto my-12" id="guide-content">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-semibold">Editor de pasos</h1>
            <div class="flex gap-2">
                <button @click="isEditing = !isEditing" class="px-5 py-2 text-white rounded flex items-center gap-2"
                    :class="[isEditing ? 'bg-red-500' : 'bg-blue-500']">
                    <img src="/assets/edit.svg" alt="edit-icon" class="w-4 h-4" />
                    <span>{{ isEditing ? "Dejar de editar" : "Editar" }}</span>
                </button>
                <button @click="downloadGuide"
                    class="px-5 py-2 bg-yellow-500 text-white rounded flex items-center gap-2">
                    <!-- <img src="/assets/download.svg" alt="download-icon" class="w-4 h-4" /> -->
                    <span>Descargar guía</span>
                </button>
            </div>
        </div>

        <div class="mb-6">
            <input v-if="isEditing" v-model="guide.title" @blur="editGuideTitle(guide.title)"
                class="text-2xl font-bold p-2 border rounded w-full" />
            <h2 v-else class="text-2xl font-bold">{{ guide.title }}</h2>
        </div>

        <ul class="mt-4 flex flex-col gap-8" id="screenshots-container">
            <li v-for="(step, index) in guide.steps" :key="index">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-9 h-9 rounded-full bg-gray-200 flex justify-center items-center">
                        <span class="text-lg">{{ index + 1 }}</span>
                    </div>
                    <input v-if="isEditing" v-model="step.title" @blur="editStepTitle(index, step.title)"
                        class="text-lg font-medium p-1 border rounded flex-grow" />
                    <p v-else class="text-lg font-medium">{{ step.title }}</p>
                </div>
                <div class="mb-5">
                    <input v-if="isEditing" v-model="step.description" @blur="editDescription(index, step.description)"
                        class="text-base p-1 border rounded w-full" />
                    <p v-else class="text-base">{{ step.description }}</p>
                </div>
                <div v-if="isEditing">
                    <input v-model="step.actionUrl" class="mb-4 text-sm" />
                    <button @click="isEditing = false">Guardar</button>
                </div>
                <div v-else>
                    <p v-if="step.actionUrl" class="mb-4 text-sm text-blue-600">
                        <a :href="step.actionUrl" target="_blank">{{ step.actionUrl }}</a>
                        <button @click="isEditing = true">Editar</button>
                    </p>
                    <p v-else class="mb-4 text-sm text-red-600">
                        No se capturó URL de acción
                        <button @click="isEditing = true">Agregar</button>
                    </p>
                </div>
                <div class="relative">
                    <img :src="step.screenshotUrl" class="w-full h-auto" :alt="step.description"
                        @load="onImageLoad($event, index)" />
                    <div v-if="step.focusData" class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                        :style="cutoutStyle(step.focusData)"></div>
                </div>
                <div v-if="isEditing" class="flex flex-col gap-2 mt-2">
                    <input type="file" @change="uploadImage($event, index)" class="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100" />
                    <div v-if="currentFocusStep === index" class="flex gap-2">
                        <input type="number" :value="Math.round(step.focusData.scaledElementWidth)"
                            class="w-20 p-1 border rounded" placeholder="Width" />
                        <input type="number" :value="Math.round(step.focusData.scaledElementHeight)"
                            class="w-20 p-1 border rounded" placeholder="Height" />
                    </div>
                    <input v-model="step.actionUrl" @blur="editActionUrl(index, step.actionUrl)"
                        class="p-1 border rounded w-full" placeholder="URL de la acción" />
                    <button @click="removeStep(index)" class="px-4 py-2 bg-red-500 text-white rounded">Eliminar
                        Paso</button>
                </div>
            </li>
        </ul>
        <button v-if="isEditing" @click="addStep" class="mt-4 px-4 py-2 bg-green-500 text-white rounded">Agregar
            Paso</button>
    </div>
</template>
