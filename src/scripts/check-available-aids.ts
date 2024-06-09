export function checkAvailableAid(url?: string) {
    if (!url || url.indexOf("http") !== 0 || !URL.canParse(url)) {
        return;
    }

    const apiUrl = chrome.i18n.getMessage("extensionApiURL");
    try {
        const queryURL = new URL(apiUrl);

        // Consultar únicamente por el dominio.
        const queriedURL = new URL(url);
        queriedURL.pathname = "";

        queryURL.search = new URLSearchParams({
            url: queriedURL.toString(),
        }).toString();

        const resultURL = fetch(queryURL.toString())
            .then(
                (data) => {
                    if (data.status === 404) {
                        return undefined;
                    }
                    return data.json();
                },
                // reason
                (_) => {
                    return false;
                },
            )
            .then((json) => {
                try {
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
            });
        return resultURL;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
