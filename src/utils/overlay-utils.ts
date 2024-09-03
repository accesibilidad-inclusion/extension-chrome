export const OVERLAY_COOLDOWN = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

export function getDomainFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.hostname;
}

export function shouldShowOverlay(domain: string): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.local.get(domain, (result) => {
            const lastShownTime = result[domain];
            const currentTime = Date.now();

            if (!lastShownTime || currentTime - lastShownTime > OVERLAY_COOLDOWN) {
                chrome.storage.local.set({ [domain]: currentTime });
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export async function checkAvailableAid(url?: string): Promise<string | undefined> {
    if (!url || !url.startsWith("http") || !URL.canParse(url)) {
        return undefined;
    }

    const apiUrl = chrome.i18n.getMessage("extensionApiURL");
    try {
        const queryURL = new URL(apiUrl);
        const queriedURL = new URL(url);
        queriedURL.pathname = "";

        queryURL.search = new URLSearchParams({
            url: queriedURL.toString(),
        }).toString();

        const response = await fetch(queryURL.toString());
        if (response.status === 404) {
            return undefined;
        }

        const json = await response.json();
        if (!json || !URL.canParse(json)) {
            return undefined;
        }

        const iframeURL = new URL(json);
        iframeURL.pathname = iframeURL.pathname
            .split("/")
            .filter((part) => part)
            .slice(0, 3)
            .join("/");

        const iframeParams = new URLSearchParams(iframeURL.searchParams.toString());
        iframeParams.set("view", "embed");
        iframeURL.search = iframeParams.toString();
        return iframeURL.toString();
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
