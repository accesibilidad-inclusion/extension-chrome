/// <reference types="chrome"/>

import { checkAvailableAid } from "@/scripts/check-available-aids";
import type {
    PictosAction,
    PictosActionUrl,
    PictosActionScreenshot,
    PictosActionEditor,
    Step,
} from "@/scripts/types";
import { sendMessage } from "@/scripts/types";
import { reactive, watch } from "vue";

export const state = reactive({
    recording: false,
});

export const startRecording = () => {
    state.recording = true;
};

export const stopRecording = () => {
    state.recording = false;
};

let editorTabId: number | undefined;
let steps: Step[];

watch(
    () => state.recording,
    async (recording) => {
        console.log("recording state updated from service worker: ", recording);
        const queryOptions = { active: true, lastFocusedWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        if (tab && tab.id) {
            console.log("tab exists!, sending message to content script");
            chrome.tabs.sendMessage(tab.id, {
                action: "pictos__update-recording-state",
                data: {
                    recording: recording,
                },
            });
        }
    },
);

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch((error) => console.error(error));

chrome.action.onClicked.addListener((tab) => {
    if (editorTabId === tab.id) return;

    chrome.sidePanel
        .open({
            tabId: tab.id,
            windowId: tab.windowId,
        })
        .then(() => {
            checkAvailableAid(tab.url)?.then((url) => {
                if (url) {
                    sendMessage({
                        action: "pictos__sidepanel-show-aid",
                        url: url,
                    });
                } else {
                    sendMessage({ action: "pictos__sidepanel-empty" });
                }
            });
        });
});

const onAidAvailable = (sender: chrome.runtime.MessageSender) => {
    if (!sender.tab) {
        console.error("tabId incorrecto!");
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

    chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
        sendMessage({
            action: "pictos__add-step",
            data: {
                dataUrl: dataUrl,
                screenshot: action.data,
            },
        });
    });
};

const onOpenEditor = (action: PictosActionEditor) => {
    editorTabId = action.data.tabId;
    steps = action.data.steps;

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
        case "pictos__aid-available":
            onAidAvailable(sender);
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
