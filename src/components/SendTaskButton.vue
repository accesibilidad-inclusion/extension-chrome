<script setup lang="ts">
import { ref } from "vue";
import type { Guide } from "@/scripts/types";
import { getMessage } from "@/utils/chrome-utils";

interface Props {
    isEditing: boolean;
}

defineProps<Props>();

const emit = defineEmits<{ "on-send-guide": [], "on-before-send-guide": [] }>();

const guide = defineModel<Guide>();
const loading = ref<boolean>(false);

interface PostStep {
    label: string;
    url: string;
    focus_size: number | null;
    focus_x: number | null;
    focus_y: number | null;
    details: string;
    image: number;
    screenshot: string;
}

interface PostTask {
    online_venue_id: number;
    title: string;
    url: string;
    prerequisites: string;
    tags_text: string;
    steps: PostStep[];
}

const sendGuide = async () => {
    if (!guide.value) return;

    loading.value = true;

    let apiUrl: string = "";
    let onlineVenue: number = 0;

    const extensionInfo = await chrome.management.get(chrome.runtime.id);

    if (extensionInfo.installType === "development") {
        apiUrl = "https://dev.api.pictos.cl/api/online_tasks/contribution";
        onlineVenue = 6;
    } else {
        // TODO: Implementar para produccion.
        return;
    }

    if (apiUrl.length === 0) {
        loading.value = false;
        return;
    }

    emit("on-before-send-guide");

    const postData: PostTask = {
        online_venue_id: onlineVenue,
        title: guide.value.title,
        url:
            guide.value.url && guide.value.url.length > 0
                ? guide.value.url
                : guide.value.steps[0].actionUrl,
        prerequisites: guide.value.prerequisites || "",
        tags_text: guide.value.tags_text || "",
        steps: [],
    };

    guide.value.steps.forEach((step) => {
        const postStep: PostStep = {
            label: step.title.replace(/"/g, "'"),
            url: step.actionUrl,
            focus_size: step.focusData.radius > 0 ? step.focusData.radius * 0.8 : null,
            focus_x: step.focusData.radius > 0 ? step.focusData.x : null,
            focus_y: step.focusData.radius > 0 ? step.focusData.y : null,
            details: `<p>${step.description.replace(/"/g, "'")}</p>`,
            image: step.pictogram ? step.pictogram.id : parseInt(getMessage("defaultPictogram")),
            screenshot: step.screenshotUrl,
        };
        postData.steps.push(postStep);
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(postData);

    fetch(apiUrl, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    })
        .then((result) => {
            console.log(result);
            loading.value = false;
            emit("on-send-guide");
        })
        .catch((error) => {
            console.error(error);
            loading.value = false;
        });
};
</script>

<template>
    <button
        @click="sendGuide"
        class="button text-[#041C42] bg-white outline outline-1 text-base outline-[#041C42]"
        :disabled="isEditing || loading"
    >
        <span>{{ loading ? getMessage("sendingMessage") : getMessage("sendTask") }}</span>
    </button>
</template>

<style scoped>
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
