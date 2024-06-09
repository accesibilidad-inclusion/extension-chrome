/// <reference types="chrome"/>

import { checkAvailableAid } from "@/scripts/check-available-aids";
import type { PictosAction, PictosActionUrl, PictosActionScreenshot } from "@/scripts/types";
import { sendMessage } from "@/scripts/types";

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

const onTakeScreenshot = async (action: PictosActionScreenshot, sender: chrome.runtime.MessageSender) => {
    if (!sender.tab) {
        console.error("tabId incorrecto!");
        return;
    }

    chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
        sendMessage({
            action: "pictos__add-step",
            data: {
                dataUrl: dataUrl,
                ...action.data
            }
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
