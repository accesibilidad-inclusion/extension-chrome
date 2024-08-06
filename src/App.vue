<template>
    <main>
        <div class="h-full mb-[0px]">
            <RouterView />
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { addListener } from "@/utils/chrome-utils";

const router = useRouter();

onMounted(() => {
    addListener((request) => {
        if (request.action === "NAVIGATE_TO_EDITOR") {
            router.push("/editor");
        }
    });
});
</script>

<style>
.bg-yellow {
    background-color: #f6c254;
}

.bg-blue-dark {
    background-color: #041c42;
}
</style>
