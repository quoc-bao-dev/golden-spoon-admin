"use client";

import type { MantineTheme, MantineThemeComponents } from "@mantine/core";
import type { DatePickerInputProps } from "@mantine/dates";

// DatePickerInput component config - extends from TextInput
export const datePickerInputConfig: MantineThemeComponents["TextInput"] = {
    defaultProps: {
        // radius: "10px",
    },
    styles: (theme: MantineTheme, props: DatePickerInputProps) => {
        // Base styles cho input
        const baseStyles = {
            transition: "border-color 150ms ease, box-shadow 150ms ease",
        };

        return {
            input: baseStyles,
        };
    },
    classNames: (theme: MantineTheme, props: DatePickerInputProps) => {
        return {
            input: "!border !border-gray-200 !bg-white hover:!border-gray-300 focus:!border-brand-500 focus:!ring-2 focus:!ring-brand-500/10 focus:!ring-offset-0 focus-visible:!outline-none",
        };
    },
};
