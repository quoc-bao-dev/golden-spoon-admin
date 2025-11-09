export function formatCurrencyVND(value: number): string {
    return `${value.toLocaleString()} đ`;
}

export function splitDateTimeLabel(dateTime: string): {
    date: string;
    time: string;
} {
    if (!dateTime) {
        return { date: "", time: "" };
    }

    try {
        // Parse ISO 8601 format (UTC timezone)
        // If no timezone indicator, treat as UTC
        const utcDate = new Date(
            dateTime.endsWith("Z") ? dateTime : dateTime + "Z"
        );

        // Check if date is valid
        if (isNaN(utcDate.getTime())) {
            // Fallback for other formats (space-separated)
            const parts = dateTime.split(" ");
            return { date: parts[0] || "", time: parts[1] || "" };
        }

        // JavaScript automatically converts UTC to local timezone when using local methods
        // getDate(), getHours() etc. will return values in system's local timezone
        // Format date: DD/MM/YYYY
        const day = String(utcDate.getDate()).padStart(2, "0");
        const month = String(utcDate.getMonth() + 1).padStart(2, "0");
        const year = utcDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Format time: HH:mm
        const hours = String(utcDate.getHours()).padStart(2, "0");
        const minutes = String(utcDate.getMinutes()).padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;

        return { date: formattedDate, time: formattedTime };
    } catch (error) {
        // Fallback for other formats (space-separated)
        const parts = dateTime.split(" ");
        return { date: parts[0] || "", time: parts[1] || "" };
    }
}

export function mapTypeBadgeStyle(type: string): {
    background: string;
    color: string;
} {
    if (type === "Mua hàng") {
        return { background: "#4F6FFF", color: "white" };
    }
    return { background: "#24B5BE", color: "white" };
}

export function mapStatusBadgeStyle(status: string): {
    background: string;
    color: string;
} {
    if (status === "Hoàn thành") {
        return { background: "#E6FCF5", color: "#36B37E" };
    }
    return { background: "#FFF4E6", color: "#F59F00" };
}
