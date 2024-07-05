<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Guide } from "@/scripts/types";

const guide = ref<Guide>({
    title: "Mi Guía",
    steps: [],
});

const isEditing = ref(false);

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

onMounted(() => {
    const savedGuide = localStorage.getItem("pictos_guide");
    if (savedGuide) {
        guide.value = JSON.parse(savedGuide);
    }
});

watch(guide, saveGuideToLocalStorage, { deep: true });
</script>

<template>
    <div class="max-w-2xl mx-auto my-12">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-semibold">Editor de pasos</h1>
            <button
                @click="isEditing = !isEditing"
                class="px-5 py-2 text-white rounded flex items-center gap-2"
                :class="[isEditing ? 'bg-red-500' : 'bg-blue-500']"
            >
                <img src="/assets/edit.svg" alt="edit-icon" class="w-4 h-4" />
                <span>{{ isEditing ? "Dejar de editar" : "Editar" }}</span>
            </button>
        </div>

        <div class="mb-6">
            <input
                v-if="isEditing"
                v-model="guide.title"
                @blur="editGuideTitle(guide.title)"
                class="text-2xl font-bold p-2 border rounded w-full"
            />
            <h2 v-else class="text-2xl font-bold">{{ guide.title }}</h2>
        </div>

        <ul class="mt-4 flex flex-col gap-8" id="screenshots-container">
            <li v-for="(step, index) in guide.steps" :key="index">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-9 h-9 rounded-full bg-gray-200 flex justify-center items-center">
                        <span class="text-lg">{{ step.counter }}</span>
                    </div>
                    <input
                        v-if="isEditing"
                        v-model="step.title"
                        @blur="editStepTitle(index, step.title)"
                        class="text-lg font-medium p-1 border rounded flex-grow"
                    />
                    <p v-else class="text-lg font-medium">{{ step.title }}</p>
                </div>
                <div class="mb-5">
                    <input
                        v-if="isEditing"
                        v-model="step.description"
                        @blur="editDescription(index, step.description)"
                        class="text-base p-1 border rounded w-full"
                    />
                    <p v-else class="text-base">{{ step.description }}</p>
                </div>
                <img
                    :src="step.screenshotUrl"
                    class="w-full h-auto rounded border"
                    :alt="step.title"
                />
            </li>
        </ul>
    </div>
</template>
