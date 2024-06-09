import { checkAvailableAid } from "@/scripts/check-available-aids";
import { sendMessage } from "@/scripts/types";

checkAvailableAid(window.location.href)?.then((url) => {
    if (!url) return;

    // Elemento contendor
    const overlay = document.createElement("div");
    overlay.classList.add("pictos-overlay");
    overlay.classList.add("pictos-overlay--hidden");
    overlay.id = "pictos-overlay";

    // Mensage del overlay
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
            action: "pictos__overlay-open-sidepanel",
            url: url,
        });

        overlay.classList.remove("pictos-overlay--visible");
    });

    overlayTextMessage.appendChild(overlayTextCallToAction);
    overlayText.appendChild(overlayTextMessage);
    overlay.appendChild(overlayText);

    // Boton para cerrar overlay
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

    // Monstrar overlay despues de 350 ms
    setTimeout(() => {
        overlay.classList.add("pictos-overlay--visible");
    }, 350);

    // Enviar mensaje de aid-available
    sendMessage({ action: "pictos__aid-available" });
});
