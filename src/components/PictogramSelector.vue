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

const props = defineProps<Props>();
const guide = defineModel<Guide>();
const toogleMenu = ref<boolean>(false);

const emit = defineEmits<{ "on-save-guide": [] }>();

const togglePictogramsMenu = () => {
    toogleMenu.value = !toogleMenu.value;
};

const selectPictogram = (pictogram: PictogramImage) => {
    if (!guide.value) return;
    guide.value.steps[props.index].pictogram = pictogram;
    toogleMenu.value = false;
    emit("on-save-guide");
};

const defaultPictogram = (type: string | null) => {
    const position = ref<number>(0); // Valor por defecto: posición 0 (click)

    switch (type) {
        // Elementos de entrada de texto
        case "input":
        case "textarea":
        case "textbox":
        case "searchbox":
            position.value = 37; // 'Input -texto'
            break;

        case "select":
        case "option":
        case "listbox":
        case "combobox":
            position.value = 20; // 'Botón'
            break;

        case "button":
        case "a":
        case "link":
            position.value = 6; // 'Apretar boton'
            break;

        case "checkbox":
            position.value = 23; // 'Casilla-de-verificación'
            break;

        case "radio":
            position.value = 21; // 'Elegir'
            break;

        case "menuitem":
            position.value = 22; // 'Seleccionar'
            break;

        case "tab":
            position.value = 32; // 'Ventana-web'
            break;

        case "switch":
            position.value = 31; // 'Switch'
            break;

        case "image":
            position.value = 29; // 'Imagen'
            break;

        case "audio":
            position.value = 26; // 'Audio'
            break;

        case "date":
        case "time":
            position.value = 17; // 'Reloj'
            break;

        case "search":
            position.value = 14; // 'Buscar'
            break;

        case "file":
            position.value = 24; // 'Adjuntar'
            break;

        case "password":
            position.value = 25; // 'Contraseña'
            break;

        default:
            position.value = 0;
            break;
    }
    return position.value;
};

const getPictogramImageSrc = (pictogram: PictogramImage | null, type: string | null) => {
    const path = ref<string>("");
    const filename = ref<string>("");
    if (pictogram) {
        path.value = pictogram.path;
        filename.value = pictogram.filename;
        return `https://app.pictos.cl/${pictogram.path}/${pictogram.filename}`;
    }

    const id = defaultPictogram(type);
    if (id < props.pictograms.length && props.pictograms[id]) {
        path.value = props.pictograms[id].path;
        filename.value = props.pictograms[id].filename;
        return `https://app.pictos.cl/${props.pictograms[id].path}/${props.pictograms[id].filename}`;
    }

    return "";
};

const getPictogramImageAlt = (pictogram: PictogramImage | null, type: string | null) => {
    if (pictogram?.label) return pictogram.label;

    const id = defaultPictogram(type);

    if (props.pictograms && props.pictograms.length > 0 && id < props.pictograms.length) {
        const selectedPictogram = props.pictograms[id];
        if (selectedPictogram?.label) {
            return selectedPictogram.label;
        }
    }

    return "";
};
</script>

<template>
    <div class="relative content-center">
        <div v-if="!loading">
            <button
                v-if="isEditing"
                @click="togglePictogramsMenu"
                class="h-9 flex items-center justify-center"
            >
                <img
                    :src="getPictogramImageSrc(step.pictogram, step.elementType)"
                    :alt="getPictogramImageAlt(step.pictogram, step.elementType)"
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
                :src="getPictogramImageSrc(step.pictogram, step.elementType)"
                :alt="getPictogramImageAlt(step.pictogram, step.elementType)"
                class="h-9"
            />
        </div>
        <div
            v-if="toogleMenu"
            class="absolute z-[100] top-0 left-0 mt-12 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto"
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
                        :src="getPictogramImageSrc(pictogram, null)"
                        :alt="getPictogramImageAlt(pictogram, null)"
                        class="h-9"
                    />
                </button>
            </div>
        </div>
    </div>
</template>
