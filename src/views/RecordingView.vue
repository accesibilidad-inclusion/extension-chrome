<script setup lang="ts">
import { watch, onMounted, ref, computed, type CSSProperties } from "vue";
import type { AddStepData, Step, Guide } from "@/scripts/types";
import {
    addListener,
    sendMessage,
    getMessage,
    setRecording,
    getRecordingState,
    getGuideOrDefaultFromLocalStorage,
    removeGuideFromLocalStorage,
    saveGuideToLocalStorage,
} from "@/utils/chrome-utils";
import { useRouter } from "vue-router";

const guide = ref<Guide>({
    title: getMessage("taskDefaultName"),
    steps: [],
    url: "",
    prerequisites: "",
    tags_text: "",
});

const currentStepIndex = ref(0);
const showAlert = ref(false);
const isRecording = ref<boolean>(false);
const cutoutStyleValue = ref<CSSProperties>({});

const updateRecordingState = () => {
    setRecording(isRecording.value);
};

const stopRecording = () => {
    isRecording.value = false;
};

const startRecording = () => {
    isRecording.value = true;
};

watch(isRecording, updateRecordingState);

const step = computed(() => {
    if (guide.value.steps.length <= 0) return null;

    return guide.value.steps[currentStepIndex.value];
});

const prevStep = () => {
    if (currentStepIndex.value > 0) {
        currentStepIndex.value--;
    }
};

const nextStep = () => {
    if (currentStepIndex.value < guide.value.steps.length - 1) {
        currentStepIndex.value++;
    }
};

const stepImage = ref<HTMLImageElement | null>(null);
const router = useRouter();

const saveGuide = () => {
    saveGuideToLocalStorage(guide.value);
};

onMounted(() => {
    window.addEventListener("resize", () => {
        cutoutStyle();
    });

    addListener((request) => {
        getRecordingState().then((recording) => {
            if (request.action === "ADD_STEP" && recording) {
                addStep(request.data);
            }
        });
    });

    getGuideOrDefaultFromLocalStorage().then((savedGuide) => {
        guide.value = savedGuide;
        if (guide.value.steps.length > 0) {
            currentStepIndex.value = guide.value.steps.length - 1;
        }
    });

    getRecordingState().then((recording) => {
        isRecording.value = recording;
    });
});

watch(guide, saveGuide, { deep: true });

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

    if (guide.value.steps.length <= 0) {
        guide.value.url = newStep.actionUrl;
    }

    guide.value.steps.push(newStep);

    currentStepIndex.value = guide.value.steps.length - 1;
};

const clearSteps = () => {
    removeGuideFromLocalStorage().then(() => {
        stopRecording();
        guide.value.title = getMessage("taskDefaultName");
        guide.value.steps = [];
        guide.value.prerequisites = "";
        currentStepIndex.value = 0;
    });
};

const onImageLoad = (event: Event) => {
    stepImage.value = event.target as HTMLImageElement;
    const step = guide.value.steps[currentStepIndex.value];

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

    cutoutStyle();
};

const cutoutStyle = () => {
    if (!step.value) return;

    const data = step.value.focusData;

    if (data.radius <= 0) return;

    if (!stepImage.value) return;

    const x = (data.x * stepImage.value.width) / 100;
    const y = (data.y * stepImage.value.height) / 100;

    let radius = 0;
    if (stepImage.value.width >= stepImage.value.height) {
        radius = (data.radius * (stepImage.value.width / 2)) / 100;
    } else {
        radius = (data.radius * (stepImage.value.height / 2)) / 100;
    }

    cutoutStyleValue.value = {
        "mask-image": `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`,
    };
};

const openEditor = () => {
    stopRecording();
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

const goToHome = () => {
    router.push("/").then(() => {
        sendMessage({
            action: "CHECK_AVAILABLE_AID",
        });
    });
};

const goToElementos = () => {
    router.push("/elementos");
};

const alertOn = () => {
    showAlert.value = true;
};

const alertOff = () => {
    showAlert.value = false;
};
</script>

<style>
.bg-yellow {
    background-color: #f6c254;
}
.app-nav__logo {
    width: 75px;
    height: 15px;
}
.bg-dark-yellow {
    background-color: #fada98;
}
.icon-voz {
    position: absolute;
    right: 25px;
    z-index: 1;
    cursor: pointer;
}
.icon-voz-stop {
    position: absolute;
    right: 22px;
    z-index: 1;
    cursor: pointer;
}

.btn-record,
.btn-stop-record {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
    border-radius: 25px;
    font-size: 18px;
    cursor: pointer;
}

.btn-record {
    background-color: #ffffff;
    color: #222;
    border: 1px solid black;
}

.btn-stop-record {
    position: relative;
    border-radius: 9999px;
    background-color: rgb(255, 255, 255);
    color: rgb(25, 25, 25);
    font-weight: 700;
    font-size: 16px;
    overflow: hidden;
    border: 1px solid black;
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
    animation: pulse 2s infinite;
}

.btn-stop-record-animation {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgb(255, 0, 0);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
}

.btn-back,
.btn-continue {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 9999px;
    text-align: center;
}

.btn-back {
    background-color: #fff;
    border: 1px solid #222;
    color: #000000;
}

.btn-continue {
    background-color: #041c42;
    color: #ffffff;
}
</style>

<template class="bg-yellow">
    <div class="p-4 bg-yellow min-h-screen">
        <!-- Logo SVG PICTOS (Boton secreto para ir a elementos) -->
        <div class="flex justify-between items-center mb-6">
            <img
                @click="goToElementos"
                src="../../public/assets/img/logo.svg"
                class="app-nav__logo"
            />
            <button @click="goToHome" style="color: #041c42; font-size: 14px">
                {{ getMessage("backToHome") }}
            </button>
        </div>

        <!-- Botones flotantes de grabacion -->
        <button
            v-if="isRecording"
            @click="stopRecording"
            class="btn-stop-record-animation fixed bottom-5 left-[23%] flex items-center bg-white shadow-lg rounded-full border border-black z-30"
        >
            <div class="p-2 flex items-center justify-center mr-2">
                <img style="height: 32px" src="../../public/assets/img/stop.svg" />
            </div>
            <span class="font-medium" style="margin-right: 25px">
                {{ getMessage("stopRecording") }}
            </span>
        </button>
        <button
            v-else
            @click="startRecording"
            class="fixed bottom-5 left-[24%] flex items-center bg-white shadow-lg rounded-full border border-black z-30"
        >
            <div class="p-2 flex items-center justify-center mr-2">
                <img src="../../public/assets/img/video.svg" />
            </div>
            <span class="font-medium" style="margin-right: 25px">
                {{ getMessage("startRecording") }}
            </span>
        </button>

        <button
            @click="clearSteps"
            class="fixed bottom-[20px] left-5 w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-full border border-black z-30 hover:bg-gray-100"
        >
            <i class="fas fa-redo w-6 h-6" style="font-size: 22px; z-index: 999"></i>
        </button>

        <button
            v-if="guide.steps.length > 0"
            @click="alertOn"
            class="fixed bottom-[20px] right-5 w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-full border border-black z-30 hover:bg-gray-100"
        >
            <i class="fas fa-check w-6 h-6" style="font-size: 22px; z-index: 999"></i>
        </button>
        <button
            v-else
            style="opacity: 0.5"
            class="fixed bottom-[20px] right-5 w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-full border border-black z-30 hover:bg-gray-100"
        >
            <i class="fas fa-check w-6 h-6" style="font-size: 22px; z-index: 999"></i>
        </button>

        <!-- Modal -->
        <div
            v-if="showAlert"
            style="z-index: 9999"
            class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
        >
            <div
                style="border-radius: 20px !important"
                class="bg-white rounded-lg p-6 w-3/4 md:w-1/2 lg:w-1/3 relative"
            >
                <h2 class="text-xl font-semibold mb-4">{{ getMessage("alertEditorTitle") }}</h2>
                <p class="mb-4">{{ getMessage("alertEditorDescription") }}</p>
                <div class="flex justify-center mt-4">
                    <button class="btn-back text-center w-1/2 mr-2" @click="alertOff">
                        {{ getMessage("cancel") }}
                    </button>
                    <button class="btn-continue text-center w-1/2 ml-2" @click="openEditor">
                        {{ getMessage("continue") }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="guide.steps.length == 0" class="mb-6">
            <div
                class="bg-dark-yellow rounded-lg p-4 mb-6 flex flex-col justify-center items-center"
                style="border-radius: 20px; height: 500px"
            >
                <div class="w-full flex flex-col justify-center items-center h-full text-center">
                    <div class="flex justify-center items-center mb-15">
                        <p v-if="isRecording" class="font-semibold text-lg text-center">
                            {{ getMessage("recordingText1") }} <br />{{
                                getMessage("recordingText2")
                            }}
                        </p>
                        <p v-else class="font-semibold text-lg text-center">
                            {{ getMessage("notRecordingText") }}
                        </p>
                    </div>
                    <div
                        v-if="isRecording"
                        class="btn-continueYelow font-semibold w-full mb-4 flex items-center justify-center"
                    >
                        <i
                            style="font-size: 50px; position: relative; top: 100px"
                            class="fas fa-arrow-left mr-2"
                        ></i>
                    </div>
                    <div
                        v-else
                        class="btn-continueYelow font-semibold w-full mb-4 flex items-center justify-center"
                    >
                        <i
                            style="font-size: 50px; position: relative; top: 100px"
                            class="fas fa-arrow-down mr-2"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="bg-dark-yellow rounded-lg p-4 mb-6" style="border-radius: 20px">
            <!-- Navegación entre pasos -->
            <div
                class="flex justify-between items-center mb-0"
                style="font-size: 13px; font-weight: 600"
            >
                <button
                    @click="prevStep"
                    :disabled="currentStepIndex === 0"
                    class="text-dark-500 flex items-center"
                >
                    <i class="fas fa-chevron-left mr-2" style="font-size: 32px"></i>
                </button>

                <span>
                    {{ getMessage("step").charAt(0).toUpperCase() + getMessage("step").slice(1) }}
                    {{ currentStepIndex + 1 }}
                    <span v-if="guide.steps.length >= 2">{{
                        `${getMessage("of")} ${guide.steps.length}`
                    }}</span></span
                >

                <button
                    @click="nextStep"
                    :disabled="currentStepIndex >= guide.steps.length - 1"
                    class="text-dark-500 flex items-center"
                >
                    <i
                        class="fas fa-chevron-right ml-2"
                        style="font-size: 32px; font-weight: 900"
                    ></i>
                </button>
            </div>
        </div>

        <div
            v-if="guide.steps.length > 0"
            style="border-radius: 20px 20px 20px 20px"
            class="mt-4 bg-white rounded-xl mb-20"
        >
            <!-- Imagen de la tarjeta -->
            <div class="relative flex" style="border-radius: 20px 20px 0 0">
                <ul style="border-radius: 20px 20px 0 0">
                    <li v-if="step" style="border-radius: 20px 20px 0 0">
                        <div class="relative" style="border-radius: 20px 20px 0 0">
                            <img
                                :src="step.screenshotUrl"
                                class="w-full h-auto"
                                :alt="step.description"
                                @load="onImageLoad($event)"
                                style="border-radius: 20px 20px 0 0"
                            />
                            <div
                                v-if="step.focusData.radius > 0"
                                class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                                style="border-radius: 20px 20px 0 0"
                                :style="cutoutStyleValue"
                            ></div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="p-4">
                <!-- Contenido de la tarjeta -->
                <div>
                    <div class="flex flex-wrap">
                        <!-- Columna para la imagen -->
                        <div class="flex items-start">
                            <img
                                src="../../public/assets/img/web.svg"
                                width="50px"
                                alt="Ejemplo de pantalla"
                                class="rounded-lg mr-2"
                            />
                            <div class="flex flex-col">
                                <h4
                                    class="text-lg font-semibold"
                                    style="font-size: 12px; color: #004079"
                                >
                                    {{ `PASO ${currentStepIndex + 1}` }}
                                </h4>
                                <p class="text-lg font-semibold mb-2 break-words">
                                    {{ guide.steps[currentStepIndex]?.title || "Título del paso" }}
                                </p>
                            </div>
                        </div>
                        <!-- Columna para el texto -->
                        <div class="flex-grow break-words">
                            <p class="mb-2 break-words" style="font-size: 16px">
                                {{
                                    guide.steps[currentStepIndex]?.description ||
                                    "Descripción detallada del paso"
                                }}
                            </p>
                            <div>
                                <p
                                    style="font-size: 14px; color: #6c6c6c"
                                    v-if="guide.steps[currentStepIndex]?.actionUrl"
                                    class="mb-4 break-all"
                                >
                                    <a
                                        :href="guide.steps[currentStepIndex].actionUrl"
                                        target="_blank"
                                        >{{ guide.steps[currentStepIndex].actionUrl }}</a
                                    >
                                </p>
                                <p style="font-size: 14px" v-else class="mb-4">
                                    {{ getMessage("stepNoUrlMessage") }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
