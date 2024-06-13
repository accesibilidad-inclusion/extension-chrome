/// <reference types="chrome"/>

import { checkAvailableAid } from "@/scripts/check-available-aids";
import type { PictosAction, PictosActionUrl, PictosActionScreenshot } from "@/scripts/types";
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
                ...action.data,
                dataUrl: dataUrl,
            },
        });
    });
};

const addedListener = async (message: PictosAction, sender: chrome.runtime.MessageSender) => {
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
        default:
            break;
    }
};

chrome.runtime.onMessage.addListener(addedListener);
