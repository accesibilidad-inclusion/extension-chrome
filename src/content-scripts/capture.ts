import { sendMessage, addListener } from "@/utils/chrome-utils";
import { debounce } from "lodash";

let recording = false;
let observer: MutationObserver | null = null;

const initializeState = () => {
    chrome.storage.local.get(["recording"], (result) => {
        recording = result.recording || false;
        setupObservers();
    });
};

addListener((request) => {
    if (request.action === "UPDATE_RECORDING_STATE") {
        if (request.data.recording !== undefined) {
            recording = request.data.recording;
            setupObservers();
        }
    }
});

const setupObservers = () => {
    setupInteractiveElements();
    setupMutationObserver();
};

const createTitle = (el: Element): string => {
    const tagName = el.tagName.toLowerCase();
    const textContent = el.textContent?.trim() || "";
    let title = "";

    switch (tagName) {
        case "button":
        case "a":
            title = textContent
                ? `Haz click en el botón "${textContent}"`
                : "Haz click en el botón";
            break;
        case "input": {
            const placeholder = (el as HTMLInputElement).placeholder;
            const label = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
            if (label) {
                title = `Ingresa tu ${label.toLowerCase()}`;
            } else if (placeholder) {
                title = `Ingresa tu ${placeholder.toLowerCase()}`;
            } else {
                title = `Ingresa el valor en el campo de entrada`;
            }

            if (!(el as HTMLInputElement).hasAttribute("autocomplete")) {
                (el as HTMLInputElement).setAttribute("autocomplete", "off");
            }

            break;
        }
        case "select": {
            const selectedOption = (el as HTMLSelectElement).selectedOptions[0]?.textContent;
            if (selectedOption) {
                title = `Selecciona "${selectedOption}" en el menú desplegable`;
            } else {
                title = `Selecciona una opción en el menú desplegable`;
            }
            break;
        }
        case "textarea":
            title = `Ingresa el texto en el área de texto`;
            break;
        default:
            title = `Interactúa con el elemento`;
            break;
    }

    return title;
};

const setupMutationObserver = () => {
    if (observer) {
        observer.disconnect();
    }

    const debouncedSetup = debounce(() => {
        setupInteractiveElements();
    }, 300);

    observer = new MutationObserver((mutations) => {
        const shouldUpdate = mutations.some(
            (mutation) =>
                mutation.type === "childList" ||
                (mutation.type === "attributes" &&
                    ["onclick", "tabindex", "role"].includes(mutation.attributeName!)),
        );
        if (shouldUpdate) {
            debouncedSetup();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["onclick", "tabindex", "role"],
    });
};

const setupInteractiveElements = () => {
    const interactiveElements = getInteractiveElements();

    interactiveElements.forEach((el: Element) => {
        if (!el.hasAttribute("data-interactive-setup")) {
            el.addEventListener("mouseover", handleMouseOver);
            el.addEventListener("mouseout", handleMouseOut);
            el.addEventListener("click", handleClick);
            el.setAttribute("data-interactive-setup", "true");
        }
    });
};

const handleMouseOver = (event: Event) => {
    if (!recording) return;
    const el = event.currentTarget as HTMLElement;
    el.classList.add("interactive-highlight");
};

const handleMouseOut = (event: Event) => {
    if (!recording) return;
    const el = event.currentTarget as HTMLElement;
    el.classList.remove("interactive-highlight");
};

const handleClick = (event: Event) => {
    if (!recording) return;

    const el = event.currentTarget as Element;
    const rect = el.getBoundingClientRect();
    const actualTitle = createTitle(el);

    // console.log("Capturing click event", {
    //     url: window.location.href,
    //     element: el,
    //     title: actualTitle,
    // });

    sendMessage({
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
    const elements = new Set<Element>();

    const isInteractive = (el: Element): boolean => {
        const interactiveTags = ["button", "a", "input", "select", "textarea"];
        const interactiveRoles = [
            "button",
            "link",
            "checkbox",
            "radio",
            "menuitem",
            "tab",
            "listbox",
            "option",
            "switch",
            "searchbox",
            "textbox",
            "combobox",
        ];
        const tagName = el.tagName.toLowerCase();
        const role = el.getAttribute("role");

        // Check for native interactive elements
        if (interactiveTags.includes(tagName)) {
            return true;
        }

        // Check for elements with interactive roles
        if (role && interactiveRoles.includes(role)) {
            return true;
        }

        // Check for clickable elements
        if (el.hasAttribute("onclick") || (tagName === "a" && el.hasAttribute("href"))) {
            return true;
        }

        // Check for focusable elements
        const tabIndex = el.getAttribute("tabindex");
        if (tabIndex !== null && tabIndex !== "-1") {
            return true;
        }

        // Check for contenteditable elements
        if (el.getAttribute("contenteditable") === "true") {
            return true;
        }

        return false;
    };

    const queryElements = (root: Element | Document) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function (node) {
                return isInteractive(node as Element)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        });

        let node;
        while ((node = walker.nextNode()) != null) {
            elements.add(node as Element);
        }

        if (root instanceof Element) {
            if (root.shadowRoot instanceof Element) queryElements(root.shadowRoot);
            // Check for closed shadow roots using a non-standard property
            const closedShadowRoot = (root as any).closedShadowRoot;
            if (closedShadowRoot) queryElements(closedShadowRoot);
        }
    };

    queryElements(document);

    return Array.from(elements);
};

initializeState();
