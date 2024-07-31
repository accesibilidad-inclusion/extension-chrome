/// <reference types="chrome"/>

import { checkAvailableAid } from "@/utils/overlay-utils";
import { compressImage } from "@/utils/image-utils";
import type {
    PictosAction,
    SidepanelAction,
    CaptureScreenshotAction,
    OpenEditorAction,
    UpdateRecordingStateAction,
} from "@/scripts/types";
import { sendMessage } from "@/utils/chrome-utils";
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
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
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
        //updateAllTabs();
    },
);

export const startRecording = () => {
    state.recording = true;
};

export const stopRecording = () => {
    state.recording = false;
};

// const updateAllTabs = () => {
//     chrome.tabs.query({}, (tabs) => {
//         tabs.forEach((tab) => {
//             if (tab.id && tab.url && tab.url.startsWith("http")) {
//                 chrome.tabs.sendMessage(
//                     tab.id,
//                     {
//                         action: "UPDATE_RECORDING_STATE",
//                         data: { recording: state.recording },
//                     } as UpdateRecordingStateAction,
//                     () => {
//                         if (chrome.runtime.lastError) {
//                             console.log(
//                                 `Failed to send message to tab ${tab.id}: ${chrome.runtime.lastError.message}`,
//                             );
//                         }
//                     },
//                 );
//             }
//         });
//     });
// };

let editorTabId: number | undefined;

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch((error) => console.error(error));

chrome.action.onClicked.addListener((tab) => {
    if (editorTabId !== undefined && editorTabId === tab.id) return;

    if (!tab.url) return;

    chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId }).then(() => {
        checkAvailableAid(tab.url).then((url) => {
            if (url) {
                sendMessage({ action: "LOAD_AID_IN_SIDEPANEL", url: url });
            } else {
                sendMessage({ action: "CLEAR_SIDEPANEL" });
            }
        }).catch((error) => {
            console.log("checkAvailableAid Error:", error);
        });
    });
});

chrome.runtime.onConnect.addListener((port) => {
    const tabId = port.sender?.tab?.id;
    if (!tabId) return;

    if (editorTabId !== undefined && tabId === editorTabId) return;

    chrome.tabs.sendMessage(
        tabId,
        {
            action: "UPDATE_RECORDING_STATE",
            data: { recording: state.recording },
        } as UpdateRecordingStateAction,
        () => {
            if (chrome.runtime.lastError) {
                console.log(
                    `Failed to send message to tab ${tabId}: ${chrome.runtime.lastError.message}`,
                );
            }
        },
    );
});

chrome.tabs.onUpdated.addListener((tabId) => {
    if (editorTabId !== undefined && editorTabId === tabId) {
        console.log("NAVIGATE_TO_EDITOR");
        sendMessage({
            action: "NAVIGATE_TO_EDITOR",
        }).catch((error) => {
            console.log("NAVIGATE_TO_EDITOR Error:", error);
        });
    }
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

    if (editorTabId !== undefined && sender.tab.id === editorTabId) {
        console.log("Intentando capturar imagen en el editor.");
        return;
    }

    chrome.tabs.captureVisibleTab({ format: "jpeg" }, async (dataUrl) => {
        const compressedDataUrl = await compressImage(dataUrl);

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
    if (editorTabId) {
        chrome.tabs.remove(editorTabId);
    }

    editorTabId = action.data.tabId;

    chrome.sidePanel.setOptions({
        tabId: editorTabId,
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
