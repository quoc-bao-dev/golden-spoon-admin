import { createTheme } from "@mantine/core";
import { mantineColors } from "./colors";
import {
    buttonConfig,
    cardConfig,
    textInputConfig,
    selectConfig,
    modalConfig,
    datePickerInputConfig,
} from "./components";

export const mantineTheme = createTheme({
    colors: mantineColors,
    primaryColor: "brand",
    primaryShade: 5, // Use blue-500 as primary
    defaultRadius: "8px",
    fontFamily: "var(--font-sans), system-ui, sans-serif",
    headings: {
        fontFamily: "var(--font-sans), system-ui, sans-serif",
    },
    components: {
        Button: buttonConfig,
        Card: cardConfig,
        TextInput: textInputConfig,
        Select: selectConfig,
        Modal: modalConfig,
        // DatePickerInput uses TextInput config since it extends TextInput
        DatePickerInput: datePickerInputConfig as any,
    },
    other: {
        // Custom CSS variables for additional styling
        background: "var(--background)",
        foreground: "var(--foreground)",
    },
});
