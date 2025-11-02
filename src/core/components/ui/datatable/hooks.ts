export function formatCurrencyVND(value: number): string {
    return `${value.toLocaleString()} đ`;
}

export function splitDateTimeLabel(dateTime: string): {
    date: string;
    time: string;
} {
    const parts = dateTime.split(" ");
    return { date: parts[0] || "", time: parts[1] || "" };
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


