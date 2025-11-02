"use client";

/**
 * QRCode Component
 *
 * To use this component, you need to install react-qr-code:
 * npm install react-qr-code
 *
 * Or using yarn:
 * yarn add react-qr-code
 */

import { useEffect, useState } from "react";

type QRCodeProps = {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    className?: string;
};

export const QRCode = ({
    value,
    size = 220,
    bgColor = "#FFFFFF",
    fgColor = "#000000",
    level = "H",
    className,
}: QRCodeProps) => {
    const [QRCodeComponent, setQRCodeComponent] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Dynamically import react-qr-code to avoid SSR issues
        // @ts-ignore - react-qr-code will be installed via npm
        import("react-qr-code")
            .then((module) => {
                setQRCodeComponent(() => module.default);
            })
            .catch((err) => {
                console.error(
                    "Failed to load QR code library. Please install: npm install react-qr-code",
                    err
                );
                setError(true);
            });
    }, []);

    if (error) {
        return (
            <div
                className={`bg-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 ${className}`}
                style={{ width: size, height: size }}
            >
                <span className="text-gray-400 text-sm">QR Code</span>
                <span className="text-gray-500 text-xs text-center px-2">
                    Install react-qr-code
                </span>
            </div>
        );
    }

    if (!QRCodeComponent) {
        return (
            <div
                className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                <span className="text-gray-400">Loading QR...</span>
            </div>
        );
    }

    return (
        <div className={className}>
            <QRCodeComponent
                value={value}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
        </div>
    );
};
