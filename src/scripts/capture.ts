
document.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "addStep" });
})
