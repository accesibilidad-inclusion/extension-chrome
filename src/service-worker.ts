/// <reference types="chrome"/>

import { checkAvailableAid } from "@/utils/overlay-utils";
// import { compressImage } from "@/utils/image-utils";
import type {
    PictosAction,
    SidepanelAction,
    CaptureScreenshotAction,
    OpenEditorAction,
} from "@/scripts/types";
import {
    getRecordingState,
    isUrl,
    sendMessage,
    setShowTutorial,
    updateRecordingState,
} from "@/utils/chrome-utils";

// TODO: Cambiar textos a json
// TODO: PDF
// TODO: Arreglar botones en RecordingView.

let editorTabId: number | undefined;
let currentTabId: number | undefined;

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch((error) => console.error(error));

const availableAid = async (tabUrl: string | undefined) => {
    checkAvailableAid(tabUrl)
        .then((url) => {
            if (url) {
                sendMessage({ action: "LOAD_AID_IN_SIDEPANEL", url: url }).catch((error) => {
                    console.log("LOAD_AID_IN_SIDEPANEL ERROR:", error);
                });
            } else if (isUrl(tabUrl)) {
                sendMessage({ action: "CLEAR_SIDEPANEL" }).catch((error) => {
                    console.log("CLEAR_SIDEPANEL ERROR:", error);
                });
            }
        })
        .catch((error) => {
            console.log("checkAvailableAid Error:", error);
        });
};

chrome.action.onClicked.addListener((tab) => {
    if (editorTabId !== undefined && editorTabId === tab.id) return;

    if (!tab.url) return;

    chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId }).then(() => {
        availableAid(tab.url);
    });
});

chrome.runtime.onConnect.addListener((port) => {
    const tabId = port.sender?.tab?.id;
    if (!tabId) return;

    if (editorTabId !== undefined && tabId === editorTabId) return;

    getRecordingState().then((recording) => {
        updateRecordingState(recording);
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    currentTabId = activeInfo.tabId;

    if (editorTabId !== undefined && editorTabId === currentTabId) return;

    chrome.tabs.get(currentTabId).then((tab) => {
        availableAid(tab.url);
    });
});

chrome.tabs.onUpdated.addListener((_a, _b, tab) => {
    if (editorTabId !== undefined && editorTabId === currentTabId) {
        sendMessage({
            action: "NAVIGATE_TO_EDITOR",
        }).catch((error) => {
            console.log("NAVIGATE_TO_EDITOR Error:", error);
        });
        return;
    }

    availableAid(tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === editorTabId) {
        chrome.sidePanel.setOptions({
            tabId: editorTabId,
            enabled: true,
        });
        editorTabId = undefined;
    }
});

const onShowAidsAvailableIcon = async (sender: chrome.runtime.MessageSender) => {
    if (!sender.tab?.id) {
        console.error("tab id incorrecto!");
        return;
    }

    if (sender.tab.id !== currentTabId) {
        return;
    }

    chrome.action.setIcon({
        path: "./assets/img/con-apoyo-alt.png",
        tabId: sender.tab.id,
    });
};

const onOverlayOpenSidepanel = (action: SidepanelAction, sender: chrome.runtime.MessageSender) => {
    if (!sender.tab) {
        console.error("Tab incorreta!");
        return;
    }

    if (editorTabId !== undefined && sender.tab.id === editorTabId) {
        console.error("Intentando abrir sidepanel en el editor.");
        return;
    }

    if (sender.tab.id !== currentTabId) {
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

const onTakeScreenshot = (
    action: CaptureScreenshotAction,
    sender: chrome.runtime.MessageSender,
) => {
    if (!sender.tab) {
        console.error("tabId incorrecto!");
        return;
    }

    if (editorTabId !== undefined && sender.tab.id === editorTabId) {
        console.log("Intentando capturar imagen en el editor.");
        return;
    }

    if (sender.tab.id !== currentTabId) {
        return;
    }

    chrome.tabs.captureVisibleTab({ format: "jpeg" }, (dataUrl) => {
        //const compressedDataUrl = await compressImage(dataUrl);

        sendMessage({
            action: "ADD_STEP",
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

const onOpenEditor = (action: OpenEditorAction) => {
    if (editorTabId) {
        chrome.tabs.remove(editorTabId);
    }

    editorTabId = action.data.tabId;

    chrome.sidePanel.setOptions({
        tabId: editorTabId,
        enabled: false,
    });
};

const onCheckAvailableAid = () => {
    if (!currentTabId) return;

    if (editorTabId !== undefined && editorTabId === currentTabId) return;

    chrome.tabs.get(currentTabId).then((tab) => {
        availableAid(tab.url);
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
        case "CHECK_AVAILABLE_AID":
            onCheckAvailableAid();
            break;
        default:
            break;
    }
};

chrome.runtime.onMessage.addListener(addedListener);

chrome.runtime.onInstalled.addListener(() => {
    setShowTutorial(true);
});
