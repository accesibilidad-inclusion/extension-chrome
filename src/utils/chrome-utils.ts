import type { Guide, PictosAction } from "@/scripts/types";

async function sendMessage(action: PictosAction): Promise<any> {
    return chrome.runtime.sendMessage(action);
}

function addListener(callback: (request: PictosAction) => void): void {
    chrome.runtime.onMessage.addListener(callback);
}

function getMessage(name: string): string {
    return chrome.i18n.getMessage(name);
}

async function saveGuideToLocalStorage(guide: Guide) {
    return chrome.storage.local.set({
        pictos_guide: JSON.stringify(guide),
    });
}

async function getGuideOrDefaultFromLocalStorage(): Promise<Guide> {
    const storage = await chrome.storage.local.get("pictos_guide");

    if (storage["pictos_guide"]) {
        const value = JSON.parse(storage["pictos_guide"]);
        return value as Guide;
    } else {
        return {
            title: getMessage("taskDefaultName"),
            steps: [],
            url: "",
            prerequisites: "",
            tags_text: "",
        };
    }
}

async function removeGuideFromLocalStorage() {
    return chrome.storage.local.remove("pictos_guide");
}

export {
    sendMessage,
    addListener,
    getMessage,
    saveGuideToLocalStorage,
    getGuideOrDefaultFromLocalStorage,
    removeGuideFromLocalStorage,
};
