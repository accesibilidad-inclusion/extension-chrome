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

function updateRecordingState(recording: boolean) {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id && tab.url && tab.url.startsWith("http")) {
            chrome.tabs
                .sendMessage(tab.id, {
                    action: "UPDATE_RECORDING_STATE",
                    data: { recording: recording },
                })
                .catch((error) => {
                    console.log(`Failed to send message to tab ${tab.id}: ${error}`);
                });
        }
    });
}

function setRecording(recording: boolean) {
    chrome.storage.local
        .set({
            recording: recording,
        })
        .then(() => {
            updateRecordingState(recording);
        });
}

function startRecording() {
    setRecording(true);
}

function stopRecording() {
    setRecording(false);
}

async function getRecordingState() {
    const storage = await chrome.storage.local.get("recording");

    if (storage.recording) {
        return storage.recording as boolean;
    } else {
        return false;
    }
}

function setShowTutorial(value: boolean) {
    chrome.storage.local.set({
        show_tutorial: value,
    });
}

async function getShowTutorial() {
    const storage = await chrome.storage.local.get("show_tutorial");

    if (storage.show_tutorial) {
        return storage.show_tutorial as boolean;
    } else {
        return false;
    }
}

function isUrl(url: string | undefined) {
    if (!url || !url.startsWith("http") || !URL.canParse(url)) {
        return false;
    }

    return true;
}

export {
    sendMessage,
    addListener,
    getMessage,
    saveGuideToLocalStorage,
    getGuideOrDefaultFromLocalStorage,
    removeGuideFromLocalStorage,
    updateRecordingState,
    setRecording,
    startRecording,
    stopRecording,
    getRecordingState,
    setShowTutorial,
    getShowTutorial,
    isUrl,
};
