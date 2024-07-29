<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Guide, Extent } from "@/scripts/types";
import jsPDF from "jspdf";

const guide = ref<Guide>({
    title: "Mi Guía",
    steps: [],
});

const isEditing = ref(false);
const isDefiningFocus = ref(false);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const currentFocusStep = ref<number | null>(null);

const toggleEditing = () => {
    if (isEditing.value) {
        // Si estamos saliendo del modo de edición, guardamos los cambios
        saveGuideToLocalStorage();
    }
    isEditing.value = !isEditing.value;
};

onMounted(() => {
    const savedGuide = localStorage.getItem("pictos_guide");
    if (savedGuide) {
        guide.value = JSON.parse(savedGuide);
    }
});

watch(() => guide.value.steps, () => {
    saveGuideToLocalStorage();
}, { deep: true });


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
            x: 0,
            y: 0,
            width: 0,
            height: 0,
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

                    // Inicializar el focusData con valores que indican que no hay enfoque
                    guide.value.steps[index].focusData = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    };

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




const selectionRect = ref({ left: 0, top: 0, width: 0, height: 0 });

const toggleDefiningFocus = (index: number) => {
    isDefiningFocus.value = !isDefiningFocus.value;
    currentFocusStep.value = isDefiningFocus.value ? index : null;
    isDragging.value = false;
    startX.value = 0;
    startY.value = 0;
    currentX.value = 0;
    currentY.value = 0;
    selectionRect.value = { left: 0, top: 0, width: 0, height: 0 };

    // Limpiar el enfoque existente al comenzar a definir uno nuevo
    if (isDefiningFocus.value && guide.value.steps[index]) {
        guide.value.steps[index].focusData = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }

};

const startDefiningFocus = (event: MouseEvent, index: number) => {
    if (isDefiningFocus.value && currentFocusStep.value === index) {
        isDragging.value = true;
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        startX.value = event.clientX - rect.left;
        startY.value = event.clientY - rect.top;
        currentX.value = startX.value;
        currentY.value = startY.value;
        updateSelectionRect();
        event.preventDefault();
    }
};

const updateFocus = (event: MouseEvent) => {
    if (isDragging.value && currentFocusStep.value !== null) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        currentX.value = event.clientX - rect.left;
        currentY.value = event.clientY - rect.top;
        updateSelectionRect();
        event.preventDefault();
    }
};

const updateSelectionRect = () => {
    selectionRect.value = {
        left: Math.min(startX.value, currentX.value),
        top: Math.min(startY.value, currentY.value),
        width: Math.abs(currentX.value - startX.value),
        height: Math.abs(currentY.value - startY.value)
    };
};

const finishDefiningFocus = (event: MouseEvent) => {
    if (isDragging.value && currentFocusStep.value !== null) {
        const step = guide.value.steps[currentFocusStep.value];
        const img = event.target as HTMLImageElement;

        const left = Math.min(startX.value, currentX.value);
        const top = Math.min(startY.value, currentY.value);
        const width = Math.abs(currentX.value - startX.value);
        const height = Math.abs(currentY.value - startY.value);

        if (width > 0 && height > 0) {
            const naturalX = (left * img.naturalWidth) / img.width;
            const naturalY = (top * img.naturalHeight) / img.height;
            const elementNaturalWidth = (width * img.naturalWidth) / img.width;
            const elementNaturalHeight = (height * img.naturalHeight) / img.height;

            // Usa el operador de propagación para asegurarte de que Vue detecte el cambio
            guide.value.steps[currentFocusStep.value] = {
                ...step,
                focusData: {
                    x: (naturalX * img.width) / img.naturalWidth + width / 2,
                    y: (naturalY * img.height) / img.naturalHeight + height / 2,
                    width: (elementNaturalWidth * img.width) / img.naturalWidth,
                    height: (elementNaturalHeight * img.height) / img.naturalHeight,
                }
            };
            // Guarda inmediatamente después de definir el foco
            saveGuideToLocalStorage();
        } else {
            console.error("Invalid width or height:", width, height);
        }

        isDragging.value = false;
        isDefiningFocus.value = false;
        currentFocusStep.value = null;
        selectionRect.value = { left: 0, top: 0, width: 0, height: 0 };
    }
};

const clearFocus = (index: number) => {
    if (guide.value.steps[index]) {
        guide.value.steps[index].focusData = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        saveGuideToLocalStorage();
    }
};


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
        x: (naturalX * img.width) / img.naturalWidth,
        y: (naturalY * img.height) / img.naturalHeight,
        width: (elementNaturalWidth * img.width) / img.naturalWidth,
        height: (elementNaturalHeight * img.height) / img.naturalHeight,
    };
};

const cutoutStyle = (data: Extent) => {
    if (!data || (data.width <= 0 && data.height <= 0)) return {};
    const radius = Math.max(data.width, data.height) / 2 + 0.5;
    return {
        "mask-image": `radial-gradient(circle at ${data.x}px ${data.y}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${data.x}px ${data.y}px, transparent ${radius}px, black ${radius}px)`,
    };
};

</script>


<template>
    <div class="bg-light-blue">

        <div class="max-w-4xl  mx-auto py-12" id="guide-content">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-semibold">Editor de guía</h1>
                <div class="flex gap-2">
                    <button @click="toggleEditing" class="button text-white text-base "
                        :class="[isEditing ? 'bg-[#041C42]' : 'bg-[#004079]']">
                        <img src="/assets/edit.svg" alt="edit-icon" class="w-4 h-4 mr-2" />
                        <span>{{ isEditing ? "Dejar de editar" : "Editar" }}</span>
                    </button>
                    <button @click="downloadGuide"
                        class="button text-[#041C42] bg-white outline outline-1 text-base  outline-[#041C42] ">

                        <span>Descargar guía</span>
                    </button>
                </div>
            </div>

            <div class="mb-6">
                <div v-if="isEditing" class="flex flex-col gap-2">
                    <label class="text-base font-semibold text-[#041C42]">Título de la guía</label>
                    <input v-model="guide.title" @blur="editGuideTitle(guide.title)"
                        class="text-2xl font-bold input-edit focus:ring-0  w-full" />
                </div>
                <h2 v-else class="text-2xl font-bold">{{ guide.title }}</h2>
            </div>

            <ul class="mt-4 flex flex-col gap-8" id="screenshots-container">
                <li v-for="(step, index) in guide.steps" :key="index"
                    class="bg-dark-blue outline outline-1 outline-[#041C42] rounded p-6 mb-6"
                    style="border-radius: 20px;">
                    <div class="flex items-center gap-4 mb-2">
                        <div
                            class="w-9 h-9 rounded-full bg-white outline outline-1 outline-[#041C42] flex justify-center items-center">
                            <span class="text-lg">{{ index + 1 }}</span>
                        </div>
                        <div v-if="isEditing" class="flex flex-col gap-2 w-full">
                            <label class="text-base font-semibold text-[#041C42]">Título del
                                paso</label>
                            <input v-model="step.title" @blur="editStepTitle(index, step.title)"
                                class="input-edit text-lg focus:ring-0 w-full mb-2" />
                        </div>
                        <p v-else class="text-lg  font-medium">{{ step.title }}</p>
                    </div>
                    <div class="mb-5">
                        <div v-if="isEditing" class="flex flex-col gap-2">
                            <label class="text-base font-semibold text-[#041C42]">Descripción del
                                paso</label>
                            <input v-model="step.description" @blur="editDescription(index, step.description)"
                                class="text-base input-edit focus:ring-0 w-full" />
                        </div>
                        <p v-else class="text-base">{{ step.description }}</p>
                    </div>
                    <div v-if="isEditing" class="flex flex-col gap-2">
                        <label class="text-base font-semibold text-[#041C42]">URL desde donde se
                            realizó el paso</label>
                        <input id="actionUrl" v-model="step.actionUrl" @blur="editActionUrl(index, step.actionUrl)"
                            class="mt-1 input-edit focus:ring-0 w-full" />
                    </div>
                    <div v-else class="my-5 ">
                        <a v-if="step.actionUrl" :href="step.actionUrl" target="_blank"
                            class="justify-center items-center gap-3 button !inline-flex bg-light-blue hover:bg-dark-blue text-[#041C42] outline outline-1 text-sm outline-[#041C42]">

                            <img src="/assets/link-externo.svg" alt="download-icon" class="w-4 h-4" />
                            <span>
                                Ir a sitio web
                            </span>

                        </a>
                        <p v-else class="mb-4 text-sm bg-[#041C42]/10 text-[#041C42]/50 button !inline-flex">
                            No se capturó URL de acción realizada
                        </p>
                    </div>
                    <div v-if="isEditing" class="flex gap-2 mt-6 w-full  mb-3">
                        <button @click="toggleDefiningFocus(index)" class="button text-white text-sm bg-[#004079]">
                            {{ isDefiningFocus ? "Cancelar definición de enfoque" : "Definir enfoque" }}
                        </button>
                        <button @click="clearFocus(index)"
                            class="button text-[#041C42] outline outline-1 text-sm  outline-[#041C42]">
                            Eliminar Enfoque
                        </button>
                    </div>
                    <div class="relative">
                        <img :id="'step-image-' + index" :src="step.screenshotUrl" @load="onImageLoad($event, index)"
                            @mousedown="startDefiningFocus($event, index)" @mousemove="updateFocus"
                            @mouseup="finishDefiningFocus" @mouseleave="finishDefiningFocus"
                            class="w-full rounded-2xl max-h-[640px] object-cover"
                            :style="{ cursor: isDefiningFocus && currentFocusStep === index ? 'crosshair' : 'default' }" />

                        <!-- Área de enfoque -->
                        <div v-if="step.focusData && (step.focusData.width > 0 || step.focusData.height > 0)"
                            class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-2xl"
                            :style="cutoutStyle(step.focusData)"></div>

                        <!-- Rectángulo de selección durante la definición del enfoque -->
                        <div v-if="isEditing && isDefiningFocus && currentFocusStep === index"
                            class="focus-selection absolute" :style="{
                                left: `${selectionRect.left}px`,
                                top: `${selectionRect.top}px`,
                                width: `${selectionRect.width}px`,
                                height: `${selectionRect.height}px`,
                            }"></div>
                    </div>
                    <div v-if="isEditing" class="flex flex-col gap-3 mt-2">
                        <div class="flex flex-col gap-2 mb-3">
                            <label class="text-base font-semibold text-[#041C42]">Subir imagen de
                                paso</label>
                            <input type="file" @change="uploadImage($event, index)"
                                class="button text-[#004079] outline outline-1 outline-[#004079]
                                       file:bg-[#CAE0FF] file:text-[#004079] file:rounded-xl file:outline-1 file:outline-[#00407]" />
                        </div>
                        <button @click="removeStep(index)" class="button text-white text-base bg-[#004079] ">Eliminar
                            Paso</button>
                    </div>
                </li>
            </ul>
            <button v-if="isEditing" @click="addStep" class=" mt-3 button text-white text-base bg-[#041C42]">Agregar
                Paso</button>
        </div>
    </div>
</template>
<style scoped>
.focus-selection {
    position: absolute;
    border: 2px solid blue;
    background-color: rgba(0, 0, 255, 0.2);
    pointer-events: none;
}

.app-nav__logo {
    width: 75px;
    height: 15px;
}

.bg-light-blue {
    background-color: #CAE0FF;
}

.bg-dark-blue {
    background-color: #A1C9FF;
}

.button {
    padding: 12px 24px;
    font-weight: 400;
    border-radius: 9999px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-edit {
    padding: 12px 24px;
    font-weight: 400;
    border-radius: 10px;
    text-align: start;
    display: flex;
    align-items: center;
    justify-content: start;
    outline: 1px solid #041C42;
}

.focus-selection {
    position: absolute;
    border: 2px solid blue;
    background-color: rgba(0, 0, 255, 0.2);
    pointer-events: none;
}
</style>