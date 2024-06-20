<script setup lang="ts">
import { ref } from "vue";
import type { Step } from "@/scripts/types";

const steps = ref<Step[]>([]);

chrome.runtime.sendMessage(
    {
        action: "pictos__get-editor-data",
    },
    (data: { steps: Step[] }) => {
        steps.value = data.steps;
    },
);
</script>

<template>
    <ul class="mt-4 flex flex-col gap-6" id="screenshots-container">
        <li v-for="(step, index) in steps" :key="index">
            <p class="text-lg mb-2">Paso {{ step.counter }}</p>
            <p class="mb-4">{{ step.screenshotData.description }}</p>
            <div class="relative">
                <img
                    :src="step.screenshotUrl"
                    class="w-full h-auto"
                    :alt="step.screenshotData.description"
                />
            </div>
        </li>
    </ul>
</template>
