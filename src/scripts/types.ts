// Base interfaces
interface Guide {
    title: string;
    steps: Step[];
    url: string;
    prerequisites: string;
    tags_text: string;
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
    pictogram: PictogramImage | null;
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
    x: number;
    y: number;
    radius: number;
}

interface Extent {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface PictogramImage {
    id: number;
    filename: string;
    layout: number;
    path: string;
    label: string;
    categories: string[];
    tags: string[];
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

export type {
    Guide,
    Step,
    ScreenshotData,
    FocusData,
    Extent,
    PictogramImage,
    ApplicationAction,
    PictosAction,
    SidepanelAction,
    CaptureScreenshotAction,
    AddStepAction,
    AddStepData,
    UpdateRecordingStateAction,
    OpenEditorAction,
};
