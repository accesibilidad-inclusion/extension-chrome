<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Step } from "@/scripts/types";

const steps = ref<Step[]>([]);
const isEditing = ref(false);

onMounted(() => {
    const savedSteps = localStorage.getItem("pictos_steps");
    if (savedSteps) {
        steps.value = JSON.parse(savedSteps);
    }
});
</script>

<template>
    <div class="max-w-2xl mx-auto my-12">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-semibold">Editor de pasos</h1>
            <button
                @click="isEditing = !isEditing"
                class="px-5 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
                :class="[isEditing ? 'bg-red-500' : 'bg-blue-500']"
            >
                <img src="/assets/edit.svg" alt="edit-icon" class="w-4 h-4" />
                <span>{{ isEditing ? "Dejar de editar" : "Editar" }}</span>
            </button>
        </div>
        <ul class="mt-4 flex flex-col gap-8" id="screenshots-container">
            <li v-for="(step, index) in steps" :key="index">
                <div class="flex items-center gap-4 mb-5">
                    <div class="w-9 h-9 rounded-full bg-gray-200 flex justify-center items-center">
                        <span class="text-lg">
                            {{ step.counter }}
                        </span>
                    </div>
                    <p class="text-lg font-medium">{{ step.screenshotData.description }}</p>
                </div>
                <img
                    :src="step.screenshotUrl"
                    class="w-full h-auto rounded border"
                    :alt="step.screenshotData.description"
                />
            </li>
        </ul>
    </div>
</template>
