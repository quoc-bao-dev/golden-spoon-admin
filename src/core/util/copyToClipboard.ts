/**
 * Copy text to clipboard
 * @param text - The text to copy to clipboard
 * @returns Promise<boolean> - Returns true if copy was successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        // Use modern Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    } catch (err) {
        console.error("Failed to copy text to clipboard:", err);
        return false;
    }
};
