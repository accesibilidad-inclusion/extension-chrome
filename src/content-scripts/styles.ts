const injectStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
        .interactive-highlight {
            outline: 4px solid #3b82f6 !important;
            outline-offset: 4px !important;
        }
    `;
    document.head.appendChild(style);
};

injectStyles();
