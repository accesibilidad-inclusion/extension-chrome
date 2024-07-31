<script setup lang="ts">
import { ref } from "vue";
import type { Guide, PictogramImage, Step } from "@/scripts/types";

interface Props {
    isEditing: boolean;
    loading: boolean;
    pictograms: PictogramImage[];
    index: number;
    step: Step;
}

// TODO: Emit on-save-guide

const props = defineProps<Props>();
const guide = defineModel<Guide>();
const toogleMenu = ref<boolean>(false);

const togglePictogramsMenu = () => {
    toogleMenu.value = !toogleMenu.value;
};

const selectPictogram = (pictogram: PictogramImage) => {
    if (!guide.value) return;
    guide.value.steps[props.index].pictogram = pictogram;
    toogleMenu.value = false;
};

const getPictogramImageSrc = (pictogram: PictogramImage | null) => {
    if (pictogram) return `https://app.pictos.cl/${pictogram.path}/${pictogram.filename}`;

    if (props.pictograms.length > 0)
        return `https://app.pictos.cl/${props.pictograms[0].path}/${props.pictograms[0].filename}`;

    return "";
};

const getPictogramImageAlt = (pictogram: PictogramImage | null) => {
    if (pictogram) return pictogram.label;

    if (props.pictograms.length > 0) return props.pictograms[0].label;

    return "";
};
</script>

<template>
    <div class="relative">
        <div v-if="!loading">
            <button
                v-if="isEditing"
                @click="togglePictogramsMenu()"
                class="h-9 flex items-center justify-center"
            >
                <img
                    :src="getPictogramImageSrc(step.pictogram)"
                    :alt="getPictogramImageAlt(step.pictogram)"
                    class="h-full"
                />
                <svg
                    class="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            <img
                v-else
                :src="getPictogramImageSrc(step.pictogram)"
                :alt="getPictogramImageAlt(step.pictogram)"
                class="h-9"
            />
        </div>
        <div
            v-if="toogleMenu"
            class="absolute z-[100] top-0 left-0 mt-12 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto"
            style="height: calc(100vh - 24rem)"
        >
            <div class="py-1 grid grid-cols-5 gap-2 p-2">
                <button
                    v-for="pictogram in pictograms"
                    :key="pictogram.id"
                    @click="selectPictogram(pictogram)"
                    class="focus:outline-none"
                >
                    <img
                        :src="getPictogramImageSrc(pictogram)"
                        :alt="getPictogramImageAlt(pictogram)"
                        class="h-9"
                    />
                </button>
            </div>
        </div>
    </div>
</template>
