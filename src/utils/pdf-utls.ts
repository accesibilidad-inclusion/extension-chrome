import jsPDF from "jspdf";
import { svg2pdf } from "svg2pdf.js";
import { getMessage } from "@/utils/chrome-utils";
import type { PictogramImage, Step } from "@/scripts/types";

async function pdfLinkSvg(pdf: jsPDF, x: number, y: number, url: string) {
    const width = 200;
    const height = 50;
    const radius = 25; // Radius of rounded corners

    // Set fill color, border color, and border width
    pdf.setFillColor(202, 224, 255); // Light blue color
    pdf.setDrawColor(0, 0, 0); // Black color for border
    pdf.setLineWidth(1); // Border width

    // Draw a square with rounded corners
    pdf.roundedRect(x, y, width, height, radius, radius, "F"); // Fill
    pdf.roundedRect(x, y, width, height, radius, radius, "S"); // Stroke (border)

    // Add text inside the square
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0); // White color
    pdf.text(getMessage("linkText"), x + width / 3, y + height / 2 + 3); // Adjust position as needed

    const linkSvgHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.4444 12.4444H1.55556V1.55556H7V0H1.55556C0.692222 0 0 0.7 0 1.55556V12.4444C0 13.3 0.692222 14 1.55556 14H12.4444C13.3 14 14 13.3 14 12.4444V7H12.4444V12.4444ZM8.55556 0V1.55556H11.3478L3.70222 9.20111L4.79889 10.2978L12.4444 2.65222V5.44444H14V0H8.55556Z" fill="#041C42"/>
                    </svg>`;

    // Create an SVG element from the string
    const linkSvgElement = document.createElement("div");
    linkSvgElement.innerHTML = linkSvgHTML;

    // Select the SVG element
    const linkSvg = linkSvgElement.querySelector("svg") as Element;

    await svg2pdf(linkSvg, pdf, {
        x: x + 28,
        y: y + 13,
        width: 18,
        height: 18,
    });

    // Add a link (for the entire square area)
    pdf.link(x, y, width, height, { url: url });
}

function pdfAddTextContent(
    pdf: jsPDF,
    element: Element,
    x: number,
    y: number,
    spacing: number,
    listSpacing: number,
): number {
    let currentY = y;
    let currentX = x;

    function addTextWithSpacing(text: string, style?: string) {
        const words = text.split(/(\s+)/);
        words.forEach((word) => {
            if (word.trim()) {
                if (style) {
                    const currentFont = pdf.getFont();
                    pdf.setFont(currentFont.fontName, style as any);
                }
                pdf.text(word, currentX, currentY);
                currentX += pdf.getTextWidth(word);
                if (style) {
                    const currentFont = pdf.getFont();
                    pdf.setFont(currentFont.fontName, "normal");
                }
            } else if (word === " ") {
                currentX += pdf.getTextWidth(" ");
            }
        });
    }

    for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
            addTextWithSpacing(child.textContent || "");
        } else if (child.nodeType === Node.ELEMENT_NODE && child instanceof Element) {
            switch (child.tagName.toLowerCase()) {
                case "p": {
                    if (currentX !== x) {
                        currentY += spacing;
                        currentX = x;
                    }
                    currentY = pdfAddTextContent(
                        pdf,
                        child,
                        currentX,
                        currentY,
                        spacing,
                        listSpacing,
                    );
                    currentY += spacing; // Add extra space after paragraphs
                    currentX = x;
                    break;
                }
                case "strong": {
                    addTextWithSpacing(child.textContent || "", "bold");
                    break;
                }
                case "em": {
                    addTextWithSpacing(child.textContent || "", "italic");
                    break;
                }
                case "ol":
                case "ul": {
                    if (currentX !== x) {
                        currentY += spacing;
                        currentX = x;
                    }
                    let listIndex = 1;
                    for (let j = 0; j < child.children.length; j++) {
                        const li = child.children[j];
                        if (li.tagName.toLowerCase() === "li") {
                            pdf.text(
                                `${child.tagName === "OL" ? listIndex++ + ". " : "• "} `,
                                currentX,
                                currentY,
                            );
                            currentY = pdfAddTextContent(
                                pdf,
                                li,
                                currentX + 10,
                                currentY,
                                spacing,
                                listSpacing,
                            );
                            currentY += listSpacing; // Smaller space between list items
                        }
                    }
                    currentX = x;
                    break;
                }
                case "a": {
                    const linkText = child.textContent || "";
                    const link = child.getAttribute("href") || "";
                    pdf.textWithLink(linkText, currentX, currentY, { url: link });
                    currentX += pdf.getTextWidth(linkText);
                    break;
                }
            }
        }
    }
    return currentY;
}

async function pdfStep(
    pdf: jsPDF,
    x: number,
    y: number,
    stepIndex: number,
    step: Step,
    stepCanvas: HTMLCanvasElement,
    details: HTMLElement,
) {
    const width = pdf.internal.pageSize.getWidth() - x * 2;
    const height = stepCanvas.height + stepCanvas.height * 0.5;
    const cornerRadius = 20; // Radius of rounded corners

    // Set fill color, border color, and border width
    pdf.setFillColor(161, 201, 255); // Light blue color
    pdf.setDrawColor(4, 28, 66); // Black color for border
    pdf.setLineWidth(1); // Border width

    // Draw a square with rounded corners
    pdf.roundedRect(x, y, width, height, cornerRadius, cornerRadius, "F"); // Fill
    pdf.roundedRect(x, y, width, height, cornerRadius, cornerRadius, "S"); // Stroke (border)

    const border = 45;

    const radius = 24;
    pdf.setFillColor(255, 255, 255); // Set fill color to white
    pdf.setDrawColor(0, 0, 0); // Set border color to black
    pdf.setLineWidth(1); // Set border width
    pdf.circle(x + border + radius, y + border + radius, radius); // Draw the border of the circle
    pdf.circle(x + border + radius, y + border + radius, radius, "FD"); // Draw the filled circle with border

    const textWidth = pdf.getTextWidth(stepIndex.toString());
    const textHeight = 12; // Approximate height of text
    pdf.setFontSize(12);
    pdf.text(
        stepIndex.toString(),
        x + border + radius - textWidth / 2,
        y + border + radius + textHeight / 3,
    );

    let currentY = y + border + 75;

    if (step.description.length > 0) {
        const textSize = pdfAddTextContent(pdf, details, x + border, currentY, 18, 17);
        currentY = textSize + 20;
    } else {
        currentY += 75;
    }

    await pdfLinkSvg(pdf, x + border, currentY, step.actionUrl);

    currentY += 90;

    const newStepCanvas = document.createElement("canvas") as HTMLCanvasElement;
    newStepCanvas.width = stepCanvas.width;
    newStepCanvas.height = stepCanvas.height;
    const newStepCanvasCtx = newStepCanvas.getContext("2d") as CanvasRenderingContext2D;
    newStepCanvasCtx.drawImage(stepCanvas, 0, 0, stepCanvas.width, stepCanvas.height);

    // Set the global alpha for transparency
    newStepCanvasCtx.globalAlpha = 0.7; // opacity

    // Set the fill color to black
    newStepCanvasCtx.fillStyle = "black";

    // Fill the entire canvas with the semi-transparent black color
    newStepCanvasCtx.fillRect(0, 0, newStepCanvas.width, newStepCanvas.height);

    {
        const x = (step.focusData.x * newStepCanvas.width) / 100;
        const y = (step.focusData.y * newStepCanvas.height) / 100;

        let radius = 0;
        if (newStepCanvas.width >= newStepCanvas.height) {
            radius = (step.focusData.radius * (newStepCanvas.width / 2)) / 100;
        } else {
            radius = (step.focusData.radius * (newStepCanvas.height / 2)) / 100;
        }

        // Define the circular clipping path
        newStepCanvasCtx.beginPath();
        newStepCanvasCtx.arc(x, y, radius, 0, 2 * Math.PI);
        newStepCanvasCtx.clip();

        // Draw the image
        newStepCanvasCtx.drawImage(stepCanvas, 0, 0, newStepCanvas.width, newStepCanvas.height);
    }

    const stepImage = newStepCanvas.toDataURL("image/png");
    pdf.addImage(stepImage, "PNG", x + border, currentY, newStepCanvas.width, newStepCanvas.height);

    currentY += newStepCanvas.height;

    pdf.setFillColor(255, 255, 255);
    const rectHeight = 120;
    pdf.rect(x + border, currentY, newStepCanvas.width, rectHeight / 2, "F");
    pdf.roundedRect(
        x + border,
        currentY,
        newStepCanvas.width,
        rectHeight,
        cornerRadius,
        cornerRadius,
        "F",
    );

    const getPictogramImageSrc = (pictogram: PictogramImage | null) => {
        if (pictogram) {
            return `https://app.pictos.cl/${pictogram.path}/${pictogram.filename}`;
        }

        return "https://app.pictos.cl//pictos/src/4-icons//push-button.svg";
    };

    const pictogramResponse = await fetch(getPictogramImageSrc(step.pictogram));
    const pictogramSvgHTML = await pictogramResponse.text();

    // Create an SVG element from the string
    const pictogramSvgElement = document.createElement("div");
    pictogramSvgElement.innerHTML = pictogramSvgHTML;

    // Select the SVG element
    const pictogramSvg = pictogramSvgElement.querySelector("svg") as Element;

    const pictogramSize = 50;
    await svg2pdf(pictogramSvg, pdf, {
        x: x + border + 50,
        y: currentY + rectHeight / 2 - pictogramSize / 2,
        width: pictogramSize,
        height: pictogramSize,
    });

    {
        const padding = 20;
        const maxWidth = newStepCanvas.width - (border + 100 + padding);

        pdf.setFontSize(18);

        // Measure the height of the text line
        const lineHeight = pdf.getLineHeight();

        const textLines = pdf.splitTextToSize(step.title, maxWidth);
        const totalHeight = textLines.length * lineHeight;
        const startY = currentY + rectHeight / 2 - totalHeight / 2 + 10;

        textLines.forEach((line: string, index: number) => {
            pdf.text(line, x + border + 100 + padding, startY + index * lineHeight, {
                align: "left",
            });
        });
    }
}

export { pdfLinkSvg, pdfAddTextContent, pdfStep };
