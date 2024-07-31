<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Guide, PictogramImage } from "@/scripts/types";
import { getMessage } from "@/utils/chrome-utils";
// import jsPDF from "jspdf";
import StepImage from "@/components/StepImage.vue";
import PictogramSelector from "@/components/PictogramSelector.vue";
import SendTaskButton from "@/components/SendTaskButton.vue";
import { getGuideOrDefaultFromLocalStorage, saveGuideToLocalStorage } from "@/utils/chrome-utils";

// @ts-ignore
import html2pdf from "html2pdf.js";

const guide = ref<Guide>({
    title: getMessage("taskDefaultName"),
    steps: [],
    url: "",
    prerequisites: "",
    tags_text: "",
});

const isEditing = ref(false);

const pictograms = ref<PictogramImage[]>([]);
const loadingPictograms = ref(true);

const sendedGuide = ref(false);

const saveGuide = () => {
    saveGuideToLocalStorage(guide.value).then(() => {
        console.log("Saved Guide!");
    });
};

const getPictograms = async () => {
    try {
        const response = await fetch("https://api.pictos.cl/api/images");
        const result: PictogramImage[] = await response.json();
        pictograms.value = result.filter((value) => value.path === "/pictos/src/4-icons/");
    } catch (err) {
        console.error(err);
    } finally {
        loadingPictograms.value = false;
    }
};

const toggleEditing = () => {
    if (isEditing.value) {
        // Si estamos saliendo del modo de edición, guardamos los cambios
        saveGuide();
    }
    isEditing.value = !isEditing.value;
};

onMounted(() => {
    getGuideOrDefaultFromLocalStorage().then((savedGuide) => {
        guide.value = savedGuide;
    });
    getPictograms();
});

watch(
    () => guide.value.steps,
    () => {
        saveGuide();
    },
    { deep: true },
);

const editGuideTitle = (newTitle: string) => {
    guide.value.title = newTitle;
    saveGuide();
};

const editGuideUrl = (url: string) => {
    guide.value.url = url;
    saveGuide();
};

const editPrerequisites = (prerequisites: string) => {
    guide.value.prerequisites = prerequisites;
    saveGuide();
};

const editStepTitle = (index: number, newTitle: string) => {
    if (guide.value.steps[index]) {
        guide.value.steps[index].title = newTitle;
        saveGuide();
    }
};

const editDescription = (index: number, newDescription: string) => {
    if (guide.value.steps[index]) {
        guide.value.steps[index].description = newDescription;
        saveGuide();
    }
};

const addStep = () => {
    guide.value.steps.push({
        title: getMessage("stepDefaultTitle"),
        description: "",
        elementType: "",
        screenshotUrl: "",
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
            radius: 0,
        },
        actionUrl: "", // Nuevo campo para almacenar la URL de la acción
        pictogram: null,
    });
    saveGuide();
};

const removeStep = (index: number) => {
    guide.value.steps.splice(index, 1);
    saveGuide();
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
                        radius: 0,
                    };

                    saveGuide();
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
        saveGuide();
    }
};

watch(guide, saveGuide, { deep: true });

const downloadGuide = async () => {
    const element = document.getElementById("pdf-guide");
    const opt = {
        margin: [0, 20],
        filename: `${guide.value.title}.pdf`,
        pagebreak: {
            after: "#step-element",
        },
        image: { type: "jpeg", quality: 0.98 },
        enableLinks: true,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "px", format: "letter", orientation: "portrait" },
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();

    // const pdf = new jsPDF({
    //     orientation: "portrait",
    //     unit: "px",
    //     format: "a4",
    // });

    // for (const step of guide.value.steps) {
    //     pdf.setFontSize(16);
    //     pdf.text(`Paso ${step.counter}: ${step.title}`, 20, yOffset);

    //     yOffset += 10;

    //     // Add description
    //     pdf.setFontSize(12);
    //     const descriptionLines = pdf.splitTextToSize(step.description, 170);
    //     pdf.text(descriptionLines, 20, yOffset);
    //     yOffset += 10 * descriptionLines.length;

    //     // Add screenshot
    //     const imgWidth = 170;
    //     const imgHeight = (170 * 9) / 16; // Assuming 16:9 aspect ratio, adjust if needed

    //     if (yOffset + imgHeight > 280) {
    //         pdf.addPage();
    //         yOffset = 20;
    //     }

    //     pdf.addImage(step.screenshotUrl, "PNG", 20, yOffset, imgWidth, imgHeight);
    //     yOffset += imgHeight + 20;

    //     if (yOffset > 250) {
    //         pdf.addPage();
    //         yOffset = 20;
    //     }
    // }

    // pdf.save(`${guide.value.title}.pdf`);
};

const onSendGuide = () => {
    sendedGuide.value = true;
};
</script>

<template>
    <div id="pdf-guide" class="bg-light-blue">
        <div class="max-w-4xl mx-auto py-12" id="guide-content">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-semibold">{{ getMessage("editorName") }}</h1>
                <div class="flex gap-2">
                    <button
                        @click="toggleEditing"
                        class="button text-white text-base"
                        :class="[isEditing ? 'bg-[#041C42]' : 'bg-[#004079]']"
                    >
                        <img src="/assets/edit.svg" alt="edit-icon" class="w-4 h-4 mr-2" />
                        <span>{{
                            isEditing ? getMessage("stopEditElement") : getMessage("editElement")
                        }}</span>
                    </button>
                    <button
                        @click="downloadGuide"
                        class="button text-[#041C42] bg-white outline outline-1 text-base outline-[#041C42]"
                    >
                        <span>{{ getMessage("downloadTask") }}</span>
                    </button>
                </div>
            </div>

            <div class="mb-6">
                <div v-if="isEditing" class="flex flex-col gap-2">
                    <label class="text-base font-semibold text-[#041C42]">{{
                        getMessage("taskTitleLabel")
                    }}</label>
                    <input
                        v-model="guide.title"
                        @blur="editGuideTitle(guide.title)"
                        class="text-2xl font-bold input-edit focus:ring-0 w-full"
                    />
                </div>
                <h2 v-else class="text-2xl font-bold">{{ guide.title }}</h2>

                <div v-if="isEditing" class="flex flex-col gap-2">
                    <label class="text-base font-semibold text-[#041C42]">{{
                        getMessage("taskUrlLabel")
                    }}</label>
                    <input
                        id="actionUrl"
                        v-model="guide.url"
                        @blur="editGuideUrl(guide.url)"
                        class="mt-1 input-edit focus:ring-0 w-full"
                    />
                </div>
                <div v-else class="my-5">
                    <a
                        v-if="guide.url.length > 0"
                        :href="guide.url"
                        target="_blank"
                        class="justify-center items-center gap-3 button !inline-flex bg-light-blue hover:bg-dark-blue text-[#041C42] outline outline-1 text-sm outline-[#041C42]"
                    >
                        <img src="/assets/link-externo.svg" alt="download-icon" class="w-4 h-4" />
                        <span>{{ getMessage("linkText") }}</span>
                    </a>
                    <p
                        v-else
                        class="mb-4 text-sm bg-[#041C42]/10 text-[#041C42]/50 button !inline-flex"
                    >
                        {{ getMessage("noUrlMessage") }}
                    </p>
                </div>

                <div v-if="isEditing" class="flex flex-col gap-2">
                    <label class="text-base font-semibold text-[#041C42]">{{
                        getMessage("taskPrerequisitesLabel")
                    }}</label>
                    <input
                        v-model="guide.prerequisites"
                        @blur="editPrerequisites(guide.prerequisites)"
                        class="text-base input-edit focus:ring-0 w-full"
                    />
                </div>
                <p v-else class="text-base">{{ guide.prerequisites }}</p>
            </div>

            <ul class="mt-4 flex flex-col gap-8" id="screenshots-container">
                <li
                    v-for="(step, index) in guide.steps"
                    :key="index"
                    class="bg-dark-blue outline outline-1 outline-[#041C42] rounded p-6 mb-6"
                    style="border-radius: 20px"
                    id="step-element"
                >
                    <div class="flex items-center gap-4 mb-2">
                        <div
                            class="w-9 h-9 rounded-full bg-white outline outline-1 outline-[#041C42] flex justify-center items-center"
                        >
                            <span class="text-lg">{{ index + 1 }}</span>
                        </div>
                        <div v-if="isEditing" class="flex flex-col gap-2 w-full">
                            <label class="text-base font-semibold text-[#041C42]">{{
                                getMessage("stepTitleLabel")
                            }}</label>
                            <input
                                v-model="step.title"
                                @blur="editStepTitle(index, step.title)"
                                class="input-edit text-lg focus:ring-0 w-full mb-2"
                            />
                        </div>
                        <p v-else class="text-lg font-medium">{{ step.title }}</p>
                    </div>
                    <div class="mb-5">
                        <div v-if="isEditing" class="flex flex-col gap-2">
                            <label class="text-base font-semibold text-[#041C42]">{{
                                getMessage("stepDetailsLabel")
                            }}</label>
                            <input
                                v-model="step.description"
                                @blur="editDescription(index, step.description)"
                                class="text-base input-edit focus:ring-0 w-full"
                            />
                        </div>
                        <p v-else class="text-base">{{ step.description }}</p>
                    </div>
                    <div v-if="isEditing" class="flex flex-col gap-2">
                        <label class="text-base font-semibold text-[#041C42]">{{
                            getMessage("stepUrlLabel")
                        }}</label>
                        <input
                            id="actionUrl"
                            v-model="step.actionUrl"
                            @blur="editActionUrl(index, step.actionUrl)"
                            class="mt-1 input-edit focus:ring-0 w-full"
                        />
                    </div>
                    <div v-else class="my-5">
                        <a
                            v-if="step.actionUrl"
                            :href="step.actionUrl"
                            target="_blank"
                            class="justify-center items-center gap-3 button !inline-flex bg-light-blue hover:bg-dark-blue text-[#041C42] outline outline-1 text-sm outline-[#041C42]"
                        >
                            <img
                                src="/assets/link-externo.svg"
                                alt="download-icon"
                                class="w-4 h-4"
                            />
                            <span>{{ getMessage("linkText") }}</span>
                        </a>
                        <p
                            v-else
                            class="mb-4 text-sm bg-[#041C42]/10 text-[#041C42]/50 button !inline-flex"
                        >
                            {{ getMessage("noUrlMessage") }}
                        </p>
                    </div>
                    <PictogramSelector
                        :is-editing="isEditing"
                        :loading="loadingPictograms"
                        :pictograms="pictograms"
                        :step="step"
                        :index="index"
                        v-model="guide"
                    />
                    <StepImage
                        :is-editing="isEditing"
                        :index="index"
                        @on-save-guide="saveGuide"
                        v-model="guide"
                    />
                    <div v-if="isEditing" class="flex flex-col gap-3 mt-2">
                        <div class="flex flex-col gap-2 mb-3">
                            <label class="text-base font-semibold text-[#041C42]">{{
                                getMessage("uploadNewImage")
                            }}</label>
                            <input
                                type="file"
                                @change="uploadImage($event, index)"
                                class="button text-[#004079] outline outline-1 outline-[#004079] file:bg-[#CAE0FF] file:text-[#004079] file:rounded-xl file:outline-1 file:outline-[#00407]"
                            />
                        </div>
                        <button
                            @click="removeStep(index)"
                            class="button text-white text-base bg-[#004079]"
                        >
                            {{ getMessage("deleteStep") }}
                        </button>
                    </div>
                </li>
            </ul>
            <button
                v-if="isEditing"
                @click="addStep"
                class="mt-3 button text-white text-base bg-[#041C42]"
            >
                {{ getMessage("addStep") }}
            </button>
            <SendTaskButton
                v-if="!sendedGuide"
                :is-editing="isEditing"
                @on-send-guide="onSendGuide"
                v-model="guide"
            />
        </div>
    </div>
</template>

<style scoped>
.app-nav__logo {
    width: 75px;
    height: 15px;
}

.bg-light-blue {
    background-color: #cae0ff;
}

.bg-dark-blue {
    background-color: #a1c9ff;
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
    outline: 1px solid #041c42;
}

.focus-selection {
    position: absolute;
    border: 2px solid blue;
    background-color: rgba(0, 0, 255, 0.2);
    pointer-events: none;
}
</style>
