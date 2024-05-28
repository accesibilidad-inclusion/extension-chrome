<script setup lang="ts">
    import { ref, computed } from "vue";

    interface Step {
        click: number;
    }

    const recording = ref<boolean>(false);

    const steps = ref<Step[]>([]);
    const showStepsDetails = ref<boolean>(false);

    const buttonText = computed((): string => (recording.value ? "Detener" : "Grabar"));

    const toggle = (): void => {
        recording.value = !recording.value;
    };

    const addStep = (): void => {
        steps.value.push({
            click: Date.now()
        });
    };
    const toggleSteps = (): void => {
       showStepsDetails.value = !showStepsDetails.value;
    };
    const clearSteps = (): void => {
        steps.value = [];
        toggle();
    };
</script>

<template>
    <div v-if="recording" class="p-4 mt-4 text-center">
        <button @click="addStep" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            TEMP BUTTON
        </button>
        <div class="flex flex-col">
            <p>{{ steps.length }} pasos</p>
        </div>
        <button @click="toggleSteps" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            Mostrar Pasos
        </button>
        <ul v-if="showStepsDetails" class="mt-4">
            <li v-for="(step, index) in steps" :key="index">
                {{ step.click }}
            </li>
        </ul>
    </div>
    <iframe v-else title="pictos-frame" id="pictos-frame" src="https://app.pictos.cl/inicio?view=embed" width="100%" height="100%" style="border:0;margin:0">
    </iframe>
    <div class="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-center space-x-4">
        <button @click="toggle" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-1">
            {{ buttonText }}
        </button>
        <button v-if="recording" @click="clearSteps" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex-1">
            Cancelar
        </button>
    </div>
</template>

<style scoped>
</style>
