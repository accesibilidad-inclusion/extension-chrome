let recording = false;
let observer: MutationObserver | null = null;

const initializeState = () => {
    chrome.storage.local.get(["recording"], (result) => {
        recording = result.recording || false;
        setupInteractiveElements();
        setupMutationObserver();
    });
};

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "UPDATE_RECORDING_STATE") {
        if (request.data.recording !== undefined) {
            recording = request.data.recording;
            setupInteractiveElements();
            setupMutationObserver();
        }
    }
});

const createTitle = (el: Element): string => {
    const tagName = el.tagName.toLowerCase();
    const textContent = el.textContent?.trim() || "";
    let description = "";

    switch (tagName) {
        case "button":
        case "a":
            description = textContent
                ? `Haz click en el botón "${textContent}"`
                : "Haz click en el botón";
            break;
        case "input": {
            const placeholder = (el as HTMLInputElement).placeholder;
            const label = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
            if (label) {
                description = `Ingresa tu ${label.toLowerCase()}`;
            } else if (placeholder) {
                description = `Ingresa tu ${placeholder.toLowerCase()}`;
            } else {
                description = `Ingresa el valor en el campo de entrada`;
            }

            if (!(el as HTMLInputElement).hasAttribute("autocomplete")) {
                (el as HTMLInputElement).setAttribute("autocomplete", "off");
            }

            break;
        }
        case "select": {
            const selectedOption = (el as HTMLSelectElement).selectedOptions[0]?.textContent;
            if (selectedOption) {
                description = `Selecciona "${selectedOption}" en el menú desplegable`;
            } else {
                description = `Selecciona una opción en el menú desplegable`;
            }
            break;
        }
        case "textarea":
            description = `Ingresa el texto en el área de texto`;
            break;
        default:
            description = `Interactúa con el elemento`;
            break;
    }

    return description;
};

const setupMutationObserver = () => {
    if (observer) {
        observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === "childList" || mutation.type === "attributes") {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) {
            setupInteractiveElements();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["onclick", "onmouseover", "onfocus", "tabindex"],
    });
};

const setupInteractiveElements = () => {
    const interactiveElements = getInteractiveElements();

    interactiveElements.forEach((el: Element) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
        el.removeEventListener("click", handleClick);

        if (recording) {
            el.addEventListener("mouseover", handleMouseOver);
            el.addEventListener("mouseout", handleMouseOut);
            el.addEventListener("click", handleClick);
        }
    });
};

const handleMouseOver = (event: Event) => {
    if (!recording) return;
    const el = event.target as HTMLElement;
    el.style.outline = "2px solid #3b82f6";
    el.style.outlineOffset = "4px";
};

const handleMouseOut = (event: Event) => {
    if (!recording) return;
    const el = event.target as HTMLElement;
    el.style.outline = "";
    el.style.outlineOffset = "";
};

const handleClick = (event: Event) => {
    if (!recording) return;
    const el = event.target as Element;
    const rect = el.getBoundingClientRect();
    const actualTitle = createTitle(el);

    console.log("Capturing click event", {
        url: window.location.href,
        element: el,
        title: actualTitle,
    });

    chrome.runtime.sendMessage({
        action: "CAPTURE_SCREENSHOT",
        data: {
            screenshotData: {
                screenX: rect.left + rect.width / 2,
                screenY: rect.top + rect.height / 2,
                screenElementWidth: rect.width,
                screenElementHeight: rect.height,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
            },
            title: actualTitle,
            elementType: el.tagName.toLowerCase(),
            actionUrl: window.location.href,
        },
    });
};

const getInteractiveElements = (): Element[] => {
    const interactiveTags = ["a", "button", "input", "select", "textarea"];
    const interactiveRoles = ["button", "link", "checkbox", "radio", "menuitem", "tab", "listbox"];
    const elements = new Set<Element>();

    interactiveTags.forEach((tag) => {
        document.querySelectorAll(tag).forEach((el) => elements.add(el));
    });

    interactiveRoles.forEach((role) => {
        document.querySelectorAll(`[role="${role}"]`).forEach((el) => elements.add(el));
    });

    document.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
            if (
                el.hasAttribute("onclick") ||
                el.hasAttribute("onmouseover") ||
                el.hasAttribute("onfocus") ||
                el.hasAttribute("tabindex")
            ) {
                elements.add(el);
            }
        }
    });

    return Array.from(elements);
};

initializeState();
