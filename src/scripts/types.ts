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
    actionUrl: string; 
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

interface ApplicationAction extends BaseAction {
    action: "UPDATE_ICON_AIDS_AVAILABLE" | "CLEAR_SIDEPANEL" | "NAVIGATE_TO_EDITOR";
}

interface SidepanelAction extends BaseAction {
    action: "OPEN_SIDEPANEL" | "LOAD_AID_IN_SIDEPANEL";
    url: string;
}

interface CaptureScreenshotAction extends BaseAction {
    action: "CAPTURE_SCREENSHOT";
    data: {
        screenshotData: ScreenshotData;
        title: string;
        elementType: string;
        actionUrl: string;
    };
}

interface AddStepData {
    dataUrl: string;
    screenshotData: ScreenshotData;
    title: string;
    elementType: string;
    actionUrl: string;
}

interface AddStepAction extends BaseAction {
    action: "ADD_STEP";
    data: AddStepData;
}

interface UpdateRecordingStateAction extends BaseAction {
    action: "UPDATE_RECORDING_STATE";
    data: {
        recording: boolean;
    };
}

interface OpenEditorAction extends BaseAction {
    action: "OPEN_EDITOR";
    data: {
        tabId?: number;
        guide: Guide;
    };
}

// Union type for all actions
type PictosAction =
    | ApplicationAction
    | SidepanelAction
    | CaptureScreenshotAction
    | AddStepAction
    | UpdateRecordingStateAction
    | OpenEditorAction;

// Utility functions
async function sendMessage(action: PictosAction): Promise<any> {
    return chrome.runtime.sendMessage(action);
}

function addListener(callback: (request: PictosAction) => void): void {
    chrome.runtime.onMessage.addListener(callback);
}

export type {
    Guide,
    Step,
    ScreenshotData,
    FocusData,
    ApplicationAction,
    PictosAction,
    SidepanelAction,
    CaptureScreenshotAction,
    AddStepAction,
    AddStepData,
    UpdateRecordingStateAction,
    OpenEditorAction,
};

export { sendMessage, addListener };
