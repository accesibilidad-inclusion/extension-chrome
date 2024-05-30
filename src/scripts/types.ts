export interface PictosActionAidAvailable {
    action: "pictos__aid-available";
}

export interface PictosActionUrl {
    action: "pictos__overlay-open-sidepanel" | "pictos__sidepanel-show-aid" | "pictos__sidepanel-empty";
    url: string;
}

export interface PictosActionScreenshot {
    action: "pictos__screenshot-take" | "pictos__screenshot-get";
}

export type PictosAction = PictosActionAidAvailable | PictosActionUrl | PictosActionScreenshot;

export function sendMessage(messages: PictosAction) {
}
