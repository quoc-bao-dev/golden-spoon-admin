"use client";

import type { MantineThemeComponents, MantineTheme } from "@mantine/core";
import type { SelectProps } from "@mantine/core";

export const selectConfig: MantineThemeComponents["Select"] = {
    defaultProps: {
        // radius: "10px",
    },
    styles: (theme: MantineTheme, props: SelectProps) => {
        // Base styles cho input
        const baseStyles = {
            transition: "border-color 150ms ease, box-shadow 150ms ease",
        };

        return {
            input: baseStyles,
        };
    },
    classNames: (theme: MantineTheme, props: SelectProps) => {
        return {
            input: "!border !border-gray-200 !bg-white hover:!border-gray-300 focus:!border-brand-500 focus:!ring-2 focus:!ring-brand-500/10 focus:!ring-offset-0 focus-visible:!outline-none",
        };
    },
};
