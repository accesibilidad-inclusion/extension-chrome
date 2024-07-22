import type { PictosAction } from "@/scripts/types";

chrome.runtime.onMessage.addListener((message: PictosAction) => {
    switch (message.action) {
        case "LOAD_AID_IN_SIDEPANEL": {
            const iframe = document.getElementById("pictos-frame") as HTMLIFrameElement;
            const iframeURL = new URL(message.url);
            iframeURL.pathname = iframeURL.pathname
                .split("/")
                .filter((part) => part)
                .slice(0, 3)
                .join("/");
            const iframeParams = new URLSearchParams(iframeURL.searchParams.toString());
            iframeParams.set("view", "embed");
            iframeURL.search = iframeParams.toString();
            iframe.src = iframeURL.toString();

            break;
        }
        case "CLEAR_SIDEPANEL": {
            const iframe = document.getElementById("pictos-frame") as HTMLIFrameElement;
            const iframeURL = new URL(chrome.i18n.getMessage("extensionNotFoundUrl"));
            iframeURL.search = new URLSearchParams({ url: "" }).toString();
            iframe.src = iframeURL.toString();

            break;
        }
        default:
            break;
    }
});
