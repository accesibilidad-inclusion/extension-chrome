/// <reference types="chrome"/>

import { checkAvailableAid } from "@/utils/overlay-utils";
import { compressImage } from "@/utils/image-utils";
import type {
    Guide,
    PictosAction,
    SidepanelAction,
    CaptureScreenshotAction,
    OpenEditorAction,
    UpdateRecordingStateAction,
} from "@/scripts/types";
import { sendMessage } from "@/scripts/types";
import { reactive, watch } from "vue";

export const state = reactive({
    recording: false,
});

// Vamos a usar la API de storage de Chrome para persistir el estado reactivo
chrome.storage.local.get(["recording"], (result) => {
    state.recording = result.recording || false;
});

watch(
    () => state.recording,
    (newValue) => {
        chrome.storage.local.set({ recording: newValue });
        updateAllTabs();
    },
);

export const startRecording = () => {
    state.recording = true;
};

export const stopRecording = () => {
    state.recording = false;
};
const updateAllTabs = () => {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.id && tab.url && tab.url.startsWith("http")) {
                chrome.tabs.sendMessage(
                    tab.id,
                    {
                        action: "UPDATE_RECORDING_STATE",
                        data: { recording: state.recording },
                    } as UpdateRecordingStateAction,
                    () => {
                        if (chrome.runtime.lastError) {
                            console.log(
                                `Failed to send message to tab ${tab.id}: ${chrome.runtime.lastError.message}`,
                            );
                        }
                    },
                );
            }
        });
    });
};

let editorTabId: number | undefined;
let guide: Guide;

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch((error) => console.error(error));

chrome.action.onClicked.addListener(async (tab) => {
    if (editorTabId === tab.id || !tab.url) return;

    try {
        await chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId });

        const url = await checkAvailableAid(tab.url);
        if (url) {
            sendMessage({ action: "LOAD_AID_IN_SIDEPANEL", url: url });
        } else {
            sendMessage({ action: "CLEAR_SIDEPANEL" });
        }
    } catch (error) {
        console.error("Error in chrome.action.onClicked:", error);
    }
});

const onShowAidsAvailableIcon = async (sender: chrome.runtime.MessageSender) => {
    if (!sender.tab?.id) {
        console.error("tab id incorrecto!");
        return;
    }

    chrome.action.setIcon({
        path: "./assets/img/con-apoyo-alt.png",
        tabId: sender.tab.id,
    });
};

const onOverlayOpenSidepanel = (action: SidepanelAction, sender: chrome.runtime.MessageSender) => {
    if (!sender.tab) {
        console.error("tabId incorrecto!");
        return;
    }

    chrome.sidePanel
        .open({
            tabId: sender.tab.id,
            windowId: sender.tab.windowId,
        })
        .then(() => {
            setTimeout(() => {
                sendMessage({
                    action: "LOAD_AID_IN_SIDEPANEL",
                    url: action.url,
                });
            }, 50);
        });
};

const onTakeScreenshot = async (
    action: CaptureScreenshotAction,
    sender: chrome.runtime.MessageSender,
) => {
    if (!sender.tab) {
        console.error("tabId incorrecto!");
        return;
    }

    chrome.tabs.captureVisibleTab({ format: "jpeg" }, async (dataUrl) => {
        const compressedDataUrl = await compressImage(dataUrl);
        console.log("Compressed image: ", compressedDataUrl);
        console.log("uncompressed image", dataUrl);

        sendMessage({
            action: "ADD_STEP",
            data: {
                dataUrl: compressedDataUrl,
                screenshotData: action.data.screenshotData,
                title: action.data.title,
                elementType: action.data.elementType,
                actionUrl: action.data.actionUrl,
            },
        });
    });
};

const onOpenEditor = (action: OpenEditorAction) => {
    editorTabId = action.data.tabId;
    guide = action.data.guide;

    chrome.sidePanel.setOptions({
        tabId: action.data.tabId,
        enabled: false,
    });
};

const addedListener = (message: PictosAction, sender: chrome.runtime.MessageSender) => {
    switch (message.action) {
        case "UPDATE_ICON_AIDS_AVAILABLE":
            onShowAidsAvailableIcon(sender);
            break;
        case "OPEN_SIDEPANEL":
            onOverlayOpenSidepanel(message, sender);
            break;
        case "CAPTURE_SCREENSHOT":
            onTakeScreenshot(message, sender);
            break;
        case "OPEN_EDITOR":
            onOpenEditor(message);
            break;
        default:
            break;
    }
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessage.addListener(addedListener);
});

chrome.tabs.onUpdated.addListener((tabId) => {
    if (tabId === editorTabId) {
        sendMessage({
            action: "NAVIGATE_TO_EDITOR",
        });
    }
});
