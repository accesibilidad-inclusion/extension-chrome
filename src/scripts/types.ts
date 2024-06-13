export interface PictosScreenshotData {
    screenX: number;
    screenY: number;
    screenElementWidth: number;
    screenElementHeight: number;
    screenWidth: number;
    screenHeight: number;
}

export interface PictosActionScreenshot {
    action: "pictos__take-screenshot";
    data: PictosScreenshotData;
}

export interface PictosActionSimple {
    action: "pictos__aid-available" | "pictos__sidepanel-empty" | "pictos__editor-route";
}

export interface PictosActionUrl {
    action: "pictos__overlay-open-sidepanel" | "pictos__sidepanel-show-aid";
    url: string;
}

export interface PictosStep {
    dataUrl: string;
    screenshot: PictosScreenshotData;
}

export interface PictosActionStep {
    action: "pictos__add-step";
    data: PictosStep;
}

export interface PictosActionRecordingState {
    action: "pictos__update-recording-state";
    data: {
        recording: boolean;
    };
}

export interface PictosActionEditor {
    action: "pictos__open-editor";
    data: {
        tabId?: number;
    };
}

export type PictosAction =
    | PictosActionSimple
    | PictosActionUrl
    | PictosActionScreenshot
    | PictosActionStep
    | PictosActionRecordingState
    | PictosActionEditor;

export function sendMessage(action: PictosAction) {
    chrome.runtime.sendMessage(action);
}

export function addListener(callback: (request: PictosAction) => void) {
    chrome.runtime.onMessage.addListener(callback);
}
