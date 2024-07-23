export interface Guide {
    title: string;
    steps: Step[];
}

export interface Step {
    title: string;
    description: string;
    elementType: string;
    screenshotUrl: string;
    counter: number;
    screenshotData: PictosScreenshotData;
    focusData: FocusData;
    actionUrl: string; 
}

export interface PictosScreenshotData {
    screenX: number;
    screenY: number;
    screenElementWidth: number;
    screenElementHeight: number;
    screenWidth: number;
    screenHeight: number;
}

export interface FocusData {
    scaledX: number;
    scaledY: number;
    scaledElementWidth: number;
    scaledElementHeight: number;
}

export interface PictosActionScreenshot {
    action: "pictos__take-screenshot";
    data: {
        screenshotData: PictosScreenshotData;
        title: string;
        elementType: string;
        actionUrl: string;
    };
}

export interface PictosActionSimple {
    action: "pictos__show-aids-available-icon" | "pictos__sidepanel-empty" | "pictos__editor-route";
}

export interface PictosActionUrl {
    action: "pictos__overlay-open-sidepanel" | "pictos__sidepanel-show-aid";
    url: string;
}

export interface PictosStep {
    dataUrl: string;
    screenshotData: PictosScreenshotData;
    title: string;
    elementType: string;
    actionUrl: string;
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
        guide: Guide;
    };
}

export type PictosAction =
    | PictosActionSimple
    | PictosActionUrl
    | PictosActionScreenshot
    | PictosActionStep
    | PictosActionRecordingState
    | PictosActionEditor;

export async function sendMessage(action: PictosAction) {
    return chrome.runtime.sendMessage(action);
}

export function addListener(callback: (request: PictosAction) => void) {
    chrome.runtime.onMessage.addListener(callback);
}
