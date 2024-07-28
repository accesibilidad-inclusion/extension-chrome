export async function compressImage(
    base64: string,
    maxWidth = 1200,
    maxHeight = 900,
    quality = 0.8,
): Promise<string> {
    // Extract the base64 data from the data URL
    const base64Data = base64.split(",")[1];

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([bytes], { type: "image/jpeg" });

    // Create ImageBitmap from Blob
    const imageBitmap = await createImageBitmap(blob);

    // Calculate new dimensions
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }

    // Create OffscreenCanvas and draw scaled image
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    if (ctx) {
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        // Convert to blob with compression
        const compressedBlob = await canvas.convertToBlob({ type: "image/jpeg", quality });

        // Convert Blob back to base64
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(compressedBlob);
        });
    } else {
        console.error("Could not get canvas context");
        return base64; // Return original if we couldn't compress
    }
}
