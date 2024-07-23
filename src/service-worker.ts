/// <reference types="chrome"/>

import { checkAvailableAid } from "@/scripts/check-available-aids";
import type {
    PictosAction,
    PictosActionUrl,
    PictosActionScreenshot,
    PictosActionEditor,
    Guide,
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
                        action: "pictos__update-recording-state",
                        data: { recording: state.recording },
                    },
                    (response) => {
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
            sendMessage({ action: "pictos__sidepanel-show-aid", url: url });
        } else {
            sendMessage({ action: "pictos__sidepanel-empty" });
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

const onOverlayOpenSidepanel = (action: PictosActionUrl, sender: chrome.runtime.MessageSender) => {
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
                    action: "pictos__sidepanel-show-aid",
                    url: action.url,
                });
            }, 50);
        });
};

const onTakeScreenshot = async (
    action: PictosActionScreenshot,
    sender: chrome.runtime.MessageSender,
) => {
    if (!sender.tab) {
        console.error("tabId incorrecto!");
        return;
    }

    chrome.tabs.captureVisibleTab({ format: "jpeg" }, (dataUrl) => {
        sendMessage({
            action: "pictos__add-step",
            data: {
                dataUrl: dataUrl,
                screenshotData: action.data.screenshotData,
                title: action.data.title,
                elementType: action.data.elementType,
                actionUrl: action.data.actionUrl,
            },
        });
    });
};

const onOpenEditor = (action: PictosActionEditor) => {
    editorTabId = action.data.tabId;
    guide = action.data.guide;

    chrome.sidePanel.setOptions({
        tabId: action.data.tabId,
        enabled: false,
    });
};

const addedListener = async (
    message: PictosAction,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void,
) => {
    switch (message.action) {
        case "pictos__show-aids-available-icon":
            onShowAidsAvailableIcon(sender);
            break;
        case "pictos__overlay-open-sidepanel":
            onOverlayOpenSidepanel(message, sender);
            break;
        case "pictos__take-screenshot":
            onTakeScreenshot(message, sender);
            break;
        case "pictos__open-editor":
            onOpenEditor(message);
            break;
        default:
            break;
    }
};

chrome.runtime.onMessage.addListener(addedListener);

chrome.tabs.onUpdated.addListener((tabId) => {
    if (tabId === editorTabId) {
        sendMessage({
            action: "pictos__editor-route",
        });
    }
});
