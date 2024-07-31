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

const currentStepIndex = ref(0);

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

<style>
.bg-yellow {
    background-color: #F6C254;
    border-radius: 10px 10px 0 0;
  }
  .app-nav__logo {
  width: 75px;
  height: 15px;
}
</style>

<template>
    <div class="p-4 bg-yellow mt-4 text-center">
      
        <div class="flex justify-between items-center mb-6">
      <!-- Logo SVG -->
      <img src="../../public/assets/img/logo.svg" class="app-nav__logo">

      <button style="color: #041C42;font-size: 14px;">Cerrar</button>
    </div>

    
        <div class="flex flex-col">
            <h4 class="text-2xl font-medium">
                {{ guide.steps.length }}
                {{ guide.steps.length === 1 ? getMessage("step") : getMessage("steps") }}
            </h4>
        </div>




    <div class="bg-white rounded-xl shadow-lg" style="border-radius: 20px">
    <!-- Contenedor de la tarjeta -->
     <div style="border-radius: 20px 20px 0 0;">

        <!-- Imagen de la tarjeta -->
        <!--<div class="relative mb-4" style="border-radius: 20px 20px 0 0;">
            <img
            :src="guide.steps[currentStepIndex]?.screenshotUrl || '../../public/assets/img/captura2.png'"
            alt="Ejemplo de pantalla"
            class="w-full rounded-t-xl"
            />
            <img
                    :src="guide.steps[currentStepIndex]?.screenshotUrl || '../../public/assets/img/captura2.png'"
                    class="w-full rounded-t-xl h-auto"
                    style="border-radius: 20px 20px 0 0;"
                    :alt="guide.steps[currentStepIndex]?.description || 'Descripción de la imagen'"
                    @load="onImageLoad($event, currentStepIndex)"
                />
                <div
                    v-if="guide.steps[currentStepIndex]?.focusData.radius > 0"
                    class="absolute z-10 top-0 left-0 w-full h-full rounded-t-xl bg-black bg-opacity-50"
                    style="border-radius: 20px 20px 0 0;"
                    :style="cutoutStyle(guide.steps[currentStepIndex]?.focusData, currentStepIndex)"
                ></div>
        </div>-->
        
        <div class="relative flex" id="screenshots-container" style="border-radius:  20px 20px 0 0;">
              <img
                :src="guide.steps[currentStepIndex]?.screenshotUrl || '../../public/assets/img/captura2.png'"
                class="w-full h-auto"
                :alt="guide.steps[currentStepIndex]?.description || 'Descripción de la imagen'"
                @load="onImageLoad($event, currentStepIndex)"
                style="border-radius:  20px 20px 0 0;"
              />
              <div
                v-if="guide.steps[currentStepIndex]?.focusData.radius > 0"
                class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                :style="cutoutStyle(guide.steps[currentStepIndex]?.focusData, currentStepIndex)"
                style="border-radius:  20px 20px 0 0;"
              ></div>
        </div>
           
        
    </div>

    <div class="p-4">

      <!-- Contenido de la tarjeta -->
      <div>
        <div class="flex mb-4">
          <!-- Columna para la imagen -->
          <div class="flex-shrink-0 mr-4">
            <img src="../../public/assets/img/web.svg" width="50px" alt="Ejemplo de pantalla" class="rounded-lg" />
          </div>

          <!-- Columna para el texto -->
          <div class="flex-grow">
            <h4 class="text-lg font-semibold mb-2" style="font-size: 12px; color: #004079;">
              {{ `PASO ${currentStepIndex + 1}` }}
            </h4>
            <p class="text-lg font-semibold mb-2">{{ guide.steps[currentStepIndex]?.title || 'Título del paso' }}</p>
            <p class="mb-2">{{ guide.steps[currentStepIndex]?.description || 'Descripción detallada del paso' }}</p>
            <div>
              <p v-if="guide.steps[currentStepIndex]?.actionUrl" class="mb-4 text-sm text-blue-600">
                <a :href="guide.steps[currentStepIndex].actionUrl" target="_blank">{{ guide.steps[currentStepIndex].actionUrl }}</a>
              </p>
              <p v-else class="mb-4 text-sm text-red-600">
                {{ getMessage("stepNoUrlMessage") }}
              </p>
            </div>
            <div class="relative">
              <img
                :src="guide.steps[currentStepIndex]?.screenshotUrl || '../../public/assets/img/captura2.png'"
                class="w-full h-auto"
                :alt="guide.steps[currentStepIndex]?.description || 'Descripción de la imagen'"
                @load="onImageLoad($event, currentStepIndex)"
              />
              <div
                v-if="guide.steps[currentStepIndex]?.focusData.radius > 0"
                class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                :style="cutoutStyle(guide.steps[currentStepIndex]?.focusData, currentStepIndex)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación entre pasos -->
      <div class="flex justify-between items-center mb-4" style="font-size: 13px; font-weight: 600;">
        <button
          @click="prevStep"
          :disabled="currentStepIndex === 0"
          class="text-dark-500 flex items-center"
        >
          <i class="fas fa-chevron-left mr-2" style="font-size: 32px;"></i>
        </button>

        <span>Paso {{ currentStepIndex + 1 }} de {{ guide.steps.length }}</span>

        <button
          @click="nextStep"
          :disabled="currentStepIndex >= guide.steps.length - 1"
          class="text-dark-500 flex items-center"
        >
          <i class="fas fa-chevron-right ml-2" style="font-size: 32px; font-weight: 900;"></i>
        </button>
      </div>

      <!-- Botones adicionales -->
      <div class="flex mt-6 gap-4">
        <button
          v-if="!state.recording"
          @click="startRecording"
          class="text-white bg-green-500 px-4 py-2 rounded"
        >
          {{ getMessage("startRecording") }}
        </button>
        <button
          v-if="state.recording"
          @click="stopRecording"
          class="text-white bg-red-500 px-4 py-2 rounded"
        >
          {{ getMessage("stopRecording") }}
        </button>
        <button
          @click="clearSteps"
          class="text-white bg-yellow-500 px-4 py-2 rounded"
        >
          {{ getMessage("clearSteps") }}
        </button>
        <button
          @click="openEditor"
          class="text-white bg-blue-500 px-4 py-2 rounded"
        >
          {{ getMessage("editSteps") }}
        </button>
      </div>
    </div>
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