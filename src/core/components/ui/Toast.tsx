"use client";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { Box } from "@mantine/core";

interface CustomToastProps {
    message: string;
    type?: "success" | "error";
}

const CustomToast = ({ message, type = "success" }: CustomToastProps) => {
    const bgColor = type === "success" ? "#28C76F" : "#EF4444";
    const iconColor = type === "success" ? "#28C76F" : "#EF4444";

    return (
        <Box
            style={{
                background: bgColor,
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                maxWidth: "400px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }}
            className="custom-toast"
        >
            {/* Left indicator bar */}
            <div
                style={{
                    position: "absolute",
                    left: "4px",
                    top: "6px",
                    bottom: "6px",
                    width: "4px",
                    backgroundColor: "#ffffffbb",
                    borderRadius: "10px",
                }}
            />
            {/* Icon container */}
            <div
                style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginLeft: "8px",
                }}
            >
                {type === "success" ? (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15 4.5L6.75 12.75L3 9"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
            {/* Message */}
            <span style={{ flex: 1 }}>{message}</span>
        </Box>
    );
};

export const CustomToaster = () => {
    return <Toaster position="top-right" />;
};

// Helper functions để sử dụng dễ dàng
export const showSuccessToast = (message: string, duration: number = 3000) => {
    toast.custom(
        (t) => (
            <div
                style={{
                    opacity: t.visible ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                }}
            >
                <CustomToast message={message} type="success" />
            </div>
        ),
        { duration }
    );
};

export const showErrorToast = (message: string, duration: number = 3000) => {
    toast.custom(
        (t) => (
            <div
                style={{
                    opacity: t.visible ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                }}
            >
                <CustomToast message={message} type="error" />
            </div>
        ),
        { duration }
    );
};
