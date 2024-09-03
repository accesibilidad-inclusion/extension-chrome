<script setup lang="ts">
import { onMounted, ref, watch, nextTick, type CSSProperties } from "vue";
import type { Guide, Extent } from "@/scripts/types";
import { getMessage } from "@/utils/chrome-utils";
import * as StackBlur from "stackblur-canvas";

// TODO: Save guide (emit) in other places of this file.
interface Props {
    isEditing: boolean;
    index: number;
}

type EditorMode = "CENSURE" | "FOCUS" | "NONE";

const guide = defineModel<Guide>();

const props = defineProps<Props>();
const emit = defineEmits<{ "on-save-guide": [] }>();

const editorMode = ref<EditorMode>("NONE");
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDragging = ref(false);
const cutoutStyleValue = ref<CSSProperties>({});

const history = ref<Extent[]>([]);
const currentBlur = ref<Extent | null>(null);

const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const selectionRect = ref({ left: 0, top: 0, width: 0, height: 0 });

const toggleDefiningFocus = () => {
    if (!props.isEditing) return;

    isDragging.value = false;
    startX.value = 0;
    startY.value = 0;
    currentX.value = 0;
    currentY.value = 0;
    selectionRect.value = { left: 0, top: 0, width: 0, height: 0 };

    if (editorMode.value === "FOCUS") {
        editorMode.value = "NONE";
        return;
    }

    editorMode.value = "FOCUS";

    // Limpiar el enfoque existente al comenzar a definir uno nuevo
    if (guide.value && guide.value.steps[props.index]) {
        guide.value.steps[props.index].focusData = {
            x: 0,
            y: 0,
            radius: 0,
        };
    }
};

const toggleDefiningCensure = () => {
    if (!props.isEditing) return;

    editorMode.value = editorMode.value !== "CENSURE" ? "CENSURE" : "NONE";
    isDragging.value = false;
    currentBlur.value = null;

    resetCanvas();
};

const getCanvasContext = () => {
    if (!canvasRef.value) return null;
    return canvasRef.value.getContext("2d", { willReadFrequently: true });
};

const clearCanvas = () => {
    if (!props.isEditing) return;

    if (!guide.value) return;

    if (editorMode.value !== "CENSURE") return;

    history.value = [];

    const img = new Image();
    img.src = guide.value.steps[props.index].screenshotUrl;

    img.onload = () => {
        if (!canvasRef.value) return;

        const ctx = getCanvasContext();
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

        canvasRef.value.width = img.naturalWidth;
        canvasRef.value.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);
    };
};

const drawBlur = () => {
    history.value.forEach((extent) => {
        if (!canvasRef.value) return;

        let x = extent.x;
        let y = extent.y;
        const width = Math.abs(extent.width);
        const height = Math.abs(extent.height);

        if (extent.width < 0) {
            x = extent.x - width;
        }

        if (extent.height < 0) {
            y = extent.y - height;
        }

        StackBlur.canvasRGBA(canvasRef.value, x, y, width, height, 6);
    });
};

const undoCanvas = () => {
    if (!props.isEditing) return;

    if (!guide.value) return;

    if (editorMode.value !== "CENSURE") return;

    if (history.value.length <= 0) return;

    const img = new Image();
    img.src = guide.value.steps[props.index].screenshotUrl;

    img.onload = () => {
        if (!canvasRef.value) return;

        const ctx = getCanvasContext();
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

        canvasRef.value.width = img.naturalWidth;
        canvasRef.value.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        history.value.pop();

        drawBlur();
    };
};

const resetCanvas = () => {
    if (!props.isEditing) return;

    if (!guide.value) return;

    if (editorMode.value !== "CENSURE") return;

    const img = new Image();
    img.src = guide.value.steps[props.index].screenshotUrl;

    img.onload = () => {
        if (!canvasRef.value) return;

        const ctx = getCanvasContext();
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

        canvasRef.value.width = img.naturalWidth;
        canvasRef.value.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        drawBlur();
    };
};

const getMousePosition = (event: MouseEvent) => {
    if (!canvasRef.value) return { x: 0, y: 0 };

    const rect = canvasRef.value.getBoundingClientRect();

    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    return {
        x: (screenX * canvasRef.value.width) / rect.width,
        y: (screenY * canvasRef.value.height) / rect.height,
    };
};

const startDrawing = (event: MouseEvent) => {
    if (!props.isEditing) return;

    if (editorMode.value !== "CENSURE") return;

    const { x, y } = getMousePosition(event);

    currentBlur.value = {
        x: x,
        y: y,
        width: 0,
        height: 0,
    };

    isDragging.value = true;
};

const draw = (event: MouseEvent) => {
    if (!props.isEditing) return;

    if (editorMode.value !== "CENSURE") return;

    if (!isDragging.value) return;

    if (!currentBlur.value) return;

    const { x, y } = getMousePosition(event);

    const newWidth = x - currentBlur.value.x;
    const newHeight = y - currentBlur.value.y;
    const oldWidth = currentBlur.value.width;
    const oldHeight = currentBlur.value.height;

    if (Math.abs(newWidth) < Math.abs(oldWidth) || Math.abs(newHeight) < Math.abs(oldHeight)) {
        resetCanvas();
    }

    currentBlur.value = {
        x: currentBlur.value.x,
        y: currentBlur.value.y,
        width: newWidth,
        height: newHeight,
    };
};

const stopDrawing = () => {
    if (!props.isEditing) return;

    if (editorMode.value !== "CENSURE") return;

    if (!isDragging.value) return;

    if (!currentBlur.value) return;

    history.value.push({
        x: currentBlur.value.x,
        y: currentBlur.value.y,
        width: currentBlur.value.width,
        height: currentBlur.value.height,
    });
    currentBlur.value = null;

    resetCanvas();

    isDragging.value = false;
};

const clearFocus = () => {
    if (guide.value && guide.value.steps[props.index]) {
        guide.value.steps[props.index].focusData = {
            x: 0,
            y: 0,
            radius: 0,
        };
        emit("on-save-guide");
    }
};

const updateSelectionRect = () => {
    selectionRect.value = {
        left: Math.min(startX.value, currentX.value),
        top: Math.min(startY.value, currentY.value),
        width: Math.abs(currentX.value - startX.value),
        height: Math.abs(currentY.value - startY.value),
    };
};

const startDefiningFocus = (event: MouseEvent) => {
    if (!props.isEditing) return;

    if (editorMode.value !== "FOCUS") return;

    isDragging.value = true;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    startX.value = event.clientX - rect.left;
    startY.value = event.clientY - rect.top;
    currentX.value = startX.value;
    currentY.value = startY.value;
    updateSelectionRect();
};

const updateFocus = (event: MouseEvent) => {
    if (!props.isEditing) return;

    if (editorMode.value !== "FOCUS") return;

    if (isDragging.value) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        currentX.value = event.clientX - rect.left;
        currentY.value = event.clientY - rect.top;
        updateSelectionRect();
    }
};

const finishDefiningFocus = () => {
    if (!props.isEditing) return;

    if (editorMode.value !== "FOCUS") return;

    if (isDragging.value) {
        const left = Math.min(startX.value, currentX.value);
        const top = Math.min(startY.value, currentY.value);
        const width = Math.abs(currentX.value - startX.value);
        const height = Math.abs(currentY.value - startY.value);

        if (width > 0 && height > 0 && canvasRef.value && guide.value) {
            const rect = canvasRef.value.getBoundingClientRect();

            const x = ((left + width / 2) * 100) / rect.width;
            const y = ((top + height / 2) * 100) / rect.height;

            let radius = 0;
            if (width >= height) {
                radius = ((width / 2) * 100) / (rect.width / 2);
            } else {
                radius = ((height / 2) * 100) / (rect.height / 2);
            }

            // Usa el operador de propagación para asegurarte de que Vue detecte el cambio
            const step = guide.value.steps[props.index];
            guide.value.steps[props.index] = {
                ...step,
                focusData: {
                    x: x,
                    y: y,
                    radius: radius + 5,
                },
            };

            cutoutStyle();

            // Guarda inmediatamente después de definir el foco
            emit("on-save-guide");
        } else {
            console.error("Invalid width or height:", width, height);
        }

        isDragging.value = false;
        selectionRect.value = { left: 0, top: 0, width: 0, height: 0 };
    }
};

const cutoutStyle = () => {
    if (!guide.value) return;

    const data = guide.value.steps[props.index].focusData;

    if (data.radius <= 0 || !canvasRef.value) return {};

    const rect = canvasRef.value.getBoundingClientRect();

    const x = (data.x * rect.width) / 100;
    const y = (data.y * rect.height) / 100;

    let radius = 0;
    if (rect.width >= rect.height) {
        radius = (data.radius * (rect.width / 2)) / 100;
    } else {
        radius = (data.radius * (rect.height / 2)) / 100;
    }

    cutoutStyleValue.value = {
        "mask-image": `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`,
        "-webkit-mask-image": `radial-gradient(circle at ${x}px ${y}px, transparent ${radius}px, black ${radius}px)`,
    };
};

const mouseDown = (event: MouseEvent) => {
    switch (editorMode.value) {
        case "CENSURE":
            startDrawing(event);
            break;
        case "FOCUS":
            startDefiningFocus(event);
            break;
        default:
            break;
    }
};

const mouseMove = (event: MouseEvent) => {
    switch (editorMode.value) {
        case "CENSURE":
            draw(event);
            break;
        case "FOCUS":
            updateFocus(event);
            break;
        default:
            break;
    }
};

const mouseUp = () => {
    switch (editorMode.value) {
        case "CENSURE":
            stopDrawing();
            break;
        case "FOCUS":
            finishDefiningFocus();
            break;
        default:
            break;
    }
};

const mouseLeave = () => {
    switch (editorMode.value) {
        case "CENSURE":
            stopDrawing();
            break;
        case "FOCUS":
            finishDefiningFocus();
            break;
        default:
            break;
    }
};

watch(
    () => props.isEditing,
    () => {
        editorMode.value = "NONE";
    },
);

watch(
    currentBlur,
    async (newBlur) => {
        if (newBlur && newBlur.width !== 0 && newBlur.height !== 0) {
            if (!props.isEditing) return;

            if (editorMode.value !== "CENSURE") return;

            if (!canvasRef.value) return;

            const ctx = getCanvasContext();
            if (!ctx) return;

            ctx.fillRect(newBlur.x, newBlur.y, newBlur.width, newBlur.height);
        }
    },
    { immediate: true },
);

onMounted(() => {
    window.addEventListener("resize", () => {
        cutoutStyle();
    });

    nextTick(() => {
        if (!guide.value) return;

        const img = new Image();
        img.src = guide.value.steps[props.index].screenshotUrl;

        img.onload = () => {
            if (!canvasRef.value) return;

            const ctx = getCanvasContext();
            if (!ctx) return;

            canvasRef.value.width = img.naturalWidth;
            canvasRef.value.height = img.naturalHeight;

            ctx.drawImage(img, 0, 0);

            cutoutStyle();
        };
    });
});

const transformFinalImage = () => {
    if (!canvasRef.value) return;

    if (!guide.value) return;

    console.log(`Transform step ${props.index}`);
    guide.value.steps[props.index].screenshotUrl = canvasRef.value.toDataURL("jpeg");
};

defineExpose({ transformFinalImage });
</script>

<template>
    <div v-if="isEditing" class="flex gap-2 mt-3 w-full mb-3">
        <button @click="toggleDefiningFocus" class="button text-white text-sm bg-[#004079]">
            {{ editorMode === "FOCUS" ? "Cancelar definición de enfoque" : "Definir enfoque" }}
        </button>
        <button @click="toggleDefiningCensure" class="button text-white text-sm bg-[#004079]">
            {{ editorMode === "CENSURE" ? "Cancelar definición de censuras" : "Definir censura" }}
        </button>
        <div v-if="editorMode === 'FOCUS'">
            <button
                @click="clearFocus"
                class="button text-[#041C42] outline outline-1 text-sm outline-[#041C42]"
            >
                {{ getMessage("deleteFocus") }}
            </button>
        </div>
        <div v-if="editorMode === 'CENSURE'" class="flex gap-2">
            <button
                @click="undoCanvas"
                class="button text-[#041C42] outline outline-1 text-sm outline-[#041C42]"
            >
                {{ getMessage("restoreCensure") }}
            </button>
            <button
                @click="clearCanvas"
                class="button text-[#041C42] outline outline-1 text-sm outline-[#041C42]"
            >
                {{ getMessage("deleteCensures") }}
            </button>
        </div>
    </div>
    <div class="relative bg-white" style="border-radius: 20px 20px 0px 0px;">
        <!-- Imagen en el canvas para realizar la censura de datos sensibles -->
        <canvas
            :id="`step-image-${index}`"
            :alt="`step-image-${index}`"
            ref="canvasRef"
            class="w-full h-auto"
            @mousedown="mouseDown($event)"
            @mousemove="mouseMove($event)"
            @mouseup="mouseUp"
            @mouseleave="mouseLeave"
            style="border-radius: 20px 20px 0px 0px;"
            :style="{ cursor: editorMode !== 'NONE' ? 'crosshair' : 'default' }"
        >
        </canvas>

        <!-- Área de enfoque -->
        <div
            v-if="guide && guide.steps[index].focusData.radius > 0 && editorMode !== 'CENSURE'"
            class="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50"
            style="border-radius: 20px 20px 0px 0px;"
            :style="cutoutStyleValue"
        ></div>

        <!-- Rectángulo de selección durante la definición del enfoque -->
        <div
            v-if="isEditing && editorMode === 'FOCUS'"
            class="focus-selection absolute"
            :style="{
                left: `${selectionRect.left}px`,
                top: `${selectionRect.top}px`,
                width: `${selectionRect.width}px`,
                height: `${selectionRect.height}px`,
            }"
        ></div>
    </div>
</template>

<style scoped>
.focus-selection {
    position: absolute;
    border: 2px solid blue;
    background-color: rgba(0, 0, 255, 0.2);
    pointer-events: none;
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
</style>
