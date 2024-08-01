<script setup lang="ts">
import { watch, onMounted, ref, nextTick } from "vue";
import type { AddStepData, FocusData, Step, Guide } from "@/scripts/types";
import { addListener, sendMessage, getMessage } from "@/scripts/types";
import { state, startRecording, stopRecording } from "@/service-worker";


// Definir props
const props = defineProps({
  taskName: {
    type: String,
    default: ''
  }
});
// Definir variables reactivas
const isSpeaking = ref(false);
const showAlert = ref(false);
const iconClass = ref('icon-voz');
const activeVoice = ref<string | null>(null);
const utterance = ref<SpeechSynthesisUtterance | null>(null);


// Función para detener la reproducción de voz
const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
    activeVoice.value = null;
    utterance.value = null;
  }
};

// Función para hablar un texto
const speakText = (text: string, voiceId: string) => {
  if (!isSpeaking.value && 'speechSynthesis' in window) {
    stopSpeaking(); // Detener cualquier discurso previo
    isSpeaking.value = true;
    activeVoice.value = voiceId;
    utterance.value = new SpeechSynthesisUtterance(text);
    utterance.value.onend = () => {
      isSpeaking.value = false;
      activeVoice.value = null;
      utterance.value = null;
    };
    window.speechSynthesis.speak(utterance.value);
  }
};

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

const alertOn = () => {
   showAlert.value = true;
   console.log("onnn")
};
const alertOff = () => {
   showAlert.value = false;
   console.log("offf")
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
    showAlert.value = false;
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
  }
.app-nav__logo {
  width: 75px;
  height: 15px;
}
.bg-dark-yellow {
  background-color: #FADA98;
}
.icon-voz {
  position: absolute;
  right: 25px;
  z-index: 1;
  cursor: pointer;
}.icon-voz-stop {
  position: absolute;
  right: 22px;
  z-index: 1;
  cursor: pointer;
}

.btn-record, .btn-stop-record {
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
  margin: 0 4px; /* Para separar los botones */
}

.btn-back {
  background-color: #FFF;
  border: 1px solid #222;
  color: #000000;
}

.btn-continue {
  background-color: #041C42;
  color: #ffffff;
}

</style>

<template class="bg-yellow">
    <div class="p-4 bg-yellow min-h-screen">
        <div class="flex justify-between items-center mb-6">
        <!-- Logo SVG -->
        <img src="../../public/assets/img/logo.svg" class="app-nav__logo">
        <button style="color: #041C42;font-size: 14px;">Cerrar</button>
    </div>
     <!-- Boton flotante -->
    <button v-if="!state.recording"
    @click="startRecording" class="fixed bottom-5 left-[24%] flex items-center bg-white shadow-lg rounded-full border border-black z-30">
            <div class="p-2 flex items-center justify-center mr-2">
                <img src="../../public/assets/img/video.svg">  
            </div>
            <span class="font-medium" style="margin-right: 25px;">
                {{ getMessage("startRecording") }} 
            </span>
      </button>
        <!-- Boton flotante -->
      <button v-if="state.recording"
        @click="stopRecording" class="btn-stop-record-animation fixed bottom-5 left-[24%] flex items-center bg-white shadow-lg rounded-full border border-black z-30">
            <div class="p-2 flex items-center justify-center mr-2">
                <img style="height: 32px;" src="../../public/assets/img/stop.svg">
            </div>
            <span class="font-medium" style="margin-right: 25px;">
                {{ getMessage("stopRecording") }} 
            </span>
      </button>

      <button @click="clearSteps" class="fixed bottom-[20px] left-5 w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-full border border-black z-30 hover:bg-gray-100">
            <i class="fas fa-redo w-6 h-6" style="font-size: 22px;z-index: 999;"></i>
        </button>

        <button @click="alertOn" class="fixed bottom-[20px] right-5 w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-full border border-black z-30 hover:bg-gray-100">
            <i class="fas fa-check w-6 h-6" style="font-size: 22px;z-index: 999;"></i>
        </button>

         <!-- Modal -->
     <div v-if="showAlert" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div style="border-radius: 20px !important;"  class="bg-white rounded-lg p-6 w-3/4 md:w-1/2 lg:w-1/3">
        <img style="width: 25px;position: absolute;right: 70px;" src="../../public/assets/img/escudo.png">
        <h2 class="text-xl font-semibold mb-4">Estas seguro de continuar</h2>
        <p class="mb-4">Ahora podras Editar los pasos.</p>
        <div style="position:relative;left: -10px;" class="flex justify-between items-center h-1/2 p-2">
          <button class="btn-back text-center w-1/2 mr-2" @click="alertOff">Cancelar</button>
          <button class="btn-continue text-center w-1/2 ml-2" @click="openEditor">Continuar</button>
        </div>
      </div>
    </div>
       
      
    <div v-if="guide.steps.length > 0" class="bg-dark-yellow rounded-lg p-4 mb-6" style="border-radius: 20px;">
        <!-- Navegación entre pasos -->
        <div class="flex justify-between items-center mb-0" style="font-size: 13px; font-weight: 600;">
        <button
          @click="prevStep"
          :disabled="currentStepIndex === 0"
          class="text-dark-500 flex items-center"
        >
          <i class="fas fa-chevron-left mr-2" style="font-size: 32px;"></i>
        </button>

        <span v-if="guide.steps.length > 0">Paso {{ currentStepIndex + 1 }} <span v-if="guide.steps.length >= 2">de {{ guide.steps.length }}</span></span>

        <button
          @click="nextStep"
          :disabled="currentStepIndex >= guide.steps.length - 1"
          class="text-dark-500 flex items-center">
          <i class="fas fa-chevron-right ml-2" style="font-size: 32px; font-weight: 900;"></i>
        </button>
      </div>
     
    </div>



    <div id="screenshots-container" v-if="guide.steps[currentStepIndex]?.focusData.radius > 0" class="bg-white rounded-xl shadow-lg mb-5" style="border-radius: 20px;">
      <!-- Contenedor de la tarjeta -->
      <div style="border-radius: 20px 20px 0 0;">

          <!-- Imagen de la tarjeta -->
          <div class="relative flex" style="border-radius: 20px 20px 0 0;">
              <img
                  :src="guide.steps[currentStepIndex]?.screenshotUrl || '../../public/assets/img/captura2.png'"
                  class="w-full h-auto"
                  :alt="guide.steps[currentStepIndex]?.description || 'Descripción de la imagen'"
                  @load="onImageLoad($event, currentStepIndex)"
                  style="border-radius: 20px 20px 0 0;"

                  
              />
              <div
                  v-if="guide.steps[currentStepIndex]?.focusData.radius > 0"
                  class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                  :style="cutoutStyle(guide.steps[currentStepIndex]?.focusData, currentStepIndex)"
                  style="border-radius: 20px 20px 0 0;"
              ></div>
          </div>
      </div>

      <div class="p-4">
          <!-- Contenido de la tarjeta -->
          <div>
              <div class="flex flex-wrap mb-4">
                  <!-- Columna para la imagen -->
                  <div class="flex-shrink-0 mr-4">
                      <img src="../../public/assets/img/web.svg" width="50px" alt="Ejemplo de pantalla" class="rounded-lg" />
                  </div>

                  <!-- Columna para el texto -->
                  <div class="flex-grow break-words">
                      <h4 class="text-lg font-semibold mb-2" style="font-size: 12px; color: #004079;">
                          {{ `PASO ${currentStepIndex + 1}` }}
                      </h4>
                      <p class="text-lg font-semibold mb-2 break-words">{{ guide.steps[currentStepIndex]?.title || 'Título del paso' }}</p>
                      <p class="mb-2 break-words">{{ guide.steps[currentStepIndex]?.description || 'Descripción detallada del paso' }}</p>
                      <div>
                          <p v-if="guide.steps[currentStepIndex]?.actionUrl" class="mb-4 text-sm text-blue-600 break-all">
                              <a :href="guide.steps[currentStepIndex].actionUrl" target="_blank">{{ guide.steps[currentStepIndex].actionUrl }}</a>
                          </p>
                          <p v-else class="mb-4 text-sm text-red-600">
                              {{ getMessage("stepNoUrlMessage") }}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>

       <ul class="mt-4 flex flex-col gap-6" id="screenshots-container">
            <div v-if="guide.steps.length > 0" class="relative">
                <img
                    :src="guide.steps[currentStepIndex].screenshotUrl"
                    class="w-full h-auto"
                    :alt="guide.steps[currentStepIndex].description"
                    @load="onImageLoad($event, currentStepIndex)"
                />
            </div>
        </ul>
    </div>
</template>