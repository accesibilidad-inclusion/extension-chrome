import { checkAvailableAid, shouldShowOverlay, getDomainFromUrl } from "@/utils/overlay-utils";
import { sendMessage } from "@/scripts/types";

async function initializeOverlay() {
    // Check if we're in a content script context
    if (window.location.protocol.startsWith("http")) {
        const currentUrl = window.location.href;
        const domain = getDomainFromUrl(currentUrl);

        console.log(`Initializing overlay for domain: ${domain}`);

        const url = await checkAvailableAid(currentUrl);
        if (!url) {
            console.log("No aid available, not showing overlay");
            return;
        } else {
            sendMessage({ action: "UPDATE_ICON_AIDS_AVAILABLE" });
        }

        const showOverlay = await shouldShowOverlay(domain);

        if (!showOverlay) {
            console.log("Overlay cooldown active, not showing overlay");
            return;
        }

        console.log("Creating and showing overlay");
        createAndShowOverlay(url);
    } else {
        console.log("Not in content script context, skipping overlay initialization");
    }
}

function createAndShowOverlay(url: string) {
    // Elemento contenedor
    const overlay = document.createElement("div");
    overlay.classList.add("pictos-overlay");
    overlay.classList.add("pictos-overlay--hidden");
    overlay.id = "pictos-overlay";

    // Mensaje del overlay
    const overlayText = document.createElement("div");
    overlayText.classList.add("pictos-overlay__text");

    const overlayTextMessage = document.createElement("span");
    overlayTextMessage.id = "pictos-overlay__message";
    overlayTextMessage.textContent = chrome.i18n.getMessage("overlayText");

    // Icono miron
    const overlayIcon = document.createElement("span");
    overlayIcon.classList.add("pictos-overlay__icon");
    overlayIcon.id = "pictos-overlay__icon";

    overlayText.prepend(overlayIcon);

    // Call to action
    const overlayTextCallToAction = document.createElement("span");
    overlayTextCallToAction.classList.add("pictos-overlay__cta");
    overlayTextCallToAction.id = "pictos-overlay__cta";
    overlayTextCallToAction.textContent = chrome.i18n.getMessage("overlayTextCallToAction");
    overlayTextCallToAction.addEventListener("click", (e) => {
        e.preventDefault();

        sendMessage({
            action: "OPEN_SIDEPANEL",
            url: url,
        });

        overlay.classList.remove("pictos-overlay--visible");
    });

    overlayTextMessage.appendChild(overlayTextCallToAction);
    overlayText.appendChild(overlayTextMessage);
    overlay.appendChild(overlayText);

    // Botón para cerrar overlay
    const overlayClose = document.createElement("button");
    overlayClose.classList.add("pictos-overlay__close");
    overlayClose.textContent = chrome.i18n.getMessage("overlayTextClose");
    overlayClose.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.remove("pictos-overlay--visible");
    });

    overlay.appendChild(overlayClose);

    document.body.appendChild(overlay);

    document.addEventListener("mousemove", (e) => {
        const icon = document.getElementById("pictos-overlay__icon") as HTMLElement;
        const middle = icon?.offsetLeft + icon?.offsetWidth / 2;
        if (e.clientX < middle) {
            icon.classList.remove("pictos-overlay__icon--looking-right");
        } else {
            icon.classList.add("pictos-overlay__icon--looking-right");
        }
    });

    // Mostrar overlay después de 350 ms
    setTimeout(() => {
        overlay.classList.add("pictos-overlay--visible");
    }, 350);
}

// Call initializeOverlay when the content script loads
initializeOverlay();
