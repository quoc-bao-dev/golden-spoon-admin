"use client";

import type { MantineThemeComponents, MantineTheme } from "@mantine/core";
import type { TextInputProps } from "@mantine/core";

export const textInputConfig: MantineThemeComponents["TextInput"] = {
    defaultProps: {
        // radius: "10px",
    },
    styles: (theme: MantineTheme, props: TextInputProps) => {
        // Base styles cho input
        const baseStyles = {
            transition: "border-color 150ms ease, box-shadow 150ms ease",
        };

        return {
            input: baseStyles,
        };
    },
    classNames: (theme: MantineTheme, props: TextInputProps) => {
        return {
            input: "!border !border-gray-200 !bg-white hover:!border-gray-300 focus:!border-brand-500 focus:!ring-2 focus:!ring-brand-500/10 focus:!ring-offset-0 focus-visible:!outline-none",
        };
    },
};
