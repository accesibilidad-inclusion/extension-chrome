export interface PictosActionScreenshot {
    action: "pictos__take-screenshot";
    data: {
        x: number;
        y: number;
        imageWidth: number;
        imageHeight: number;
        elementWidth: number;
        elementHeight: number;
    };
}

export interface PictosActionSimple {
    action: "pictos__aid-available" | "pictos__sidepanel-empty";
}

export interface PictosActionUrl {
    action: "pictos__overlay-open-sidepanel" | "pictos__sidepanel-show-aid";
    url: string;
}

export interface PictosStep {
    dataUrl: string;
    x: number;
    y: number;
    imageWidth: number;
    imageHeight: number;
    elementWidth: number;
    elementHeight: number;
}

export interface PictosActionStep {
    action: "pictos__add-step";
    data: PictosStep;
}

export type PictosAction =
    | PictosActionSimple
    | PictosActionUrl
    | PictosActionScreenshot
    | PictosActionStep;

export function sendMessage(action: PictosAction) {
    chrome.runtime.sendMessage(action);
}

export function addListener(callback: (request: PictosAction) => void) {
    chrome.runtime.onMessage.addListener(callback);
}
