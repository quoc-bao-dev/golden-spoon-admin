"use client";

import type { MantineThemeComponents, MantineTheme } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";

export const buttonConfig: MantineThemeComponents["Button"] = {
    defaultProps: {
        // radius: "md",
    },
    styles: (theme: MantineTheme, props: ButtonProps) => {
        // Base styles cho tất cả variants
        const baseStyles = {
            fontWeight: 500,
            transition: "all 150ms ease",
        };

        return {
            root: baseStyles,
        };
    },
    classNames: (theme: MantineTheme, props: ButtonProps) => {
        const variant = props.variant || "filled";

        switch (variant) {
            case "default":
                return {
                    root: "!border !border-gray-200 !bg-white hover:!bg-gray-50 hover:!border-gray-300 active:!bg-gray-100 active:!border-gray-400",
                };
            case "filled":
                return {
                    root: "hover:!-translate-y-px hover:!shadow-lg active:!translate-y-0",
                };
            case "outline":
                return {
                    root: "hover:!bg-gray-50 active:!bg-gray-100",
                };
            case "light":
                return {
                    root: "hover:!bg-gray-100 active:!bg-gray-200",
                };
            case "subtle":
                return {
                    root: "hover:!bg-gray-100 active:!bg-gray-200",
                };
            default:
                return {
                    root: "",
                };
        }
    },
};
