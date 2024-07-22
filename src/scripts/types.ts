// Base interfaces
interface Guide {
    title: string;
    steps: Step[];
}

interface Step {
    title: string;
    description: string;
    elementType: string;
    screenshotUrl: string;
    counter: number;
    screenshotData: ScreenshotData;
    focusData: FocusData;
}

// Data interfaces
interface ScreenshotData {
    screenX: number;
    screenY: number;
    screenElementWidth: number;
    screenElementHeight: number;
    screenWidth: number;
    screenHeight: number;
}

interface FocusData {
    scaledX: number;
    scaledY: number;
    scaledElementWidth: number;
    scaledElementHeight: number;
}

// Action interfaces
interface BaseAction {
    action: string;
}

interface SimpleAction extends BaseAction {
    action: "pictos__show-aids-available-icon" | "pictos__sidepanel-empty" | "pictos__editor-route";
}

interface UrlAction extends BaseAction {
    action: "pictos__overlay-open-sidepanel" | "pictos__sidepanel-show-aid";
    url: string;
}

interface ScreenshotAction extends BaseAction {
    action: "pictos__take-screenshot";
    data: {
        screenshotData: ScreenshotData;
        title: string;
        elementType: string;
    };
}

interface StepAction extends BaseAction {
    action: "pictos__add-step";
    data: {
        dataUrl: string;
        screenshotData: ScreenshotData;
        title: string;
        elementType: string;
    };
}

interface RecordingStateAction extends BaseAction {
    action: "pictos__update-recording-state";
    data: {
        recording: boolean;
    };
}

interface EditorAction extends BaseAction {
    action: "pictos__open-editor";
    data: {
        tabId?: number;
        guide: Guide;
    };
}

// Union type for all actions
type PictosAction =
    | SimpleAction
    | UrlAction
    | ScreenshotAction
    | StepAction
    | RecordingStateAction
    | EditorAction;

// Utility functions
async function sendMessage(action: PictosAction): Promise<any> {
    return chrome.runtime.sendMessage(action);
}

function addListener(callback: (request: PictosAction) => void): void {
    chrome.runtime.onMessage.addListener(callback);
}

// Exports
export type {
    Guide,
    Step,
    ScreenshotData,
    FocusData,
    PictosAction,
    SimpleAction,
    UrlAction,
    ScreenshotAction,
    StepAction,
    RecordingStateAction,
    EditorAction,
};

export { sendMessage, addListener };
