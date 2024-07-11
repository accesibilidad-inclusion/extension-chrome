import { sendMessage, addListener } from "@/scripts/types";

let recording = false;
let popover: HTMLDivElement | null = null;

const initializeState = () => {
    chrome.storage.local.get(["recording"], (result) => {
        recording = result.recording || false;
        setupPopover();
    });
};

addListener((request) => {
    if (request.action === "pictos__update-recording-state") {
        if (request.data.recording !== undefined) {
            recording = request.data.recording;
            setupPopover();
        }
    }
});

/**
 * Create a description for the element
 * @param {Element} el - The element to create a description for
 * @returns {string} The description of the element
 */
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

            // Adding autocomplete attribute if not present
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

const setupPopover = () => {
    // Remove existing popover if any
    if (popover) {
        popover.remove();
    }

    // Create the popover
    popover = document.createElement("div");
    popover.classList.add("pictos-popover");
    document.body.appendChild(popover);

    // Add styles using regular CSS
    const style = document.createElement("style");
    style.textContent = `
    .pictos-popover {
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 10000;
        display: none;
    }
    `;
    document.head.appendChild(style);

    setupInteractiveElements();
};

const setupInteractiveElements = () => {
    const interactiveElements = getInteractiveElements();

    interactiveElements.forEach((el: Element) => {
        // Remove existing listeners
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
        el.removeEventListener("click", handleClick);

        // Add new listeners
        el.addEventListener("mouseover", handleMouseOver);
        el.addEventListener("mouseout", handleMouseOut);
        el.addEventListener("click", handleClick);
    });
};

const handleMouseOver = (event: Event) => {
    if (!recording || !popover) return;
    const el = event.target as Element;
    const content = createTitle(el);
    popover.textContent = content;
    popover.style.display = "block";
    const rect = el.getBoundingClientRect();
    popover.style.left = `${rect.left + window.scrollX}px`;
    popover.style.top = `${rect.bottom + window.scrollY + 5}px`;
};

const handleMouseOut = () => {
    if (!recording || !popover) return;
    popover.style.display = "none";
};

const handleClick = (event: Event) => {
    if (!recording) return;
    const el = event.target as Element;
    const rect = el.getBoundingClientRect();
    const actualTitle = createTitle(el);
    console.log("Sending screenshot message from capture.ts", Date.now());
    sendMessage({
        action: "pictos__take-screenshot",
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
        },
    });
};

/**
 * Get interactive elements from the DOM
 * @returns {Element[]} List of interactive elements
 */
const getInteractiveElements = (): Element[] => {
    const interactiveTags = ["a", "button", "input", "select", "textarea"];
    const interactiveRoles = ["button", "link"];
    const elements = new Set<Element>();

    // Get elements by interactive tags
    interactiveTags.forEach((tag) => {
        document.querySelectorAll(tag).forEach((el) => elements.add(el));
    });

    // Get elements by ARIA roles
    interactiveRoles.forEach((role) => {
        document.querySelectorAll(`[role="${role}"]`).forEach((el) => elements.add(el));
    });

    // Get elements with event attributes
    document.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
            if (
                el.hasAttribute("onclick") ||
                el.hasAttribute("onmouseover") ||
                el.hasAttribute("onfocus")
            ) {
                elements.add(el);
            }
            if (el.hasAttribute("tabindex")) {
                elements.add(el);
            }
        }
    });

    return Array.from(elements);
};

initializeState();
setupPopover();
