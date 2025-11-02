import type { MantineColorsTuple } from "@mantine/core";

/**
 * Mantine Colors Configuration - Synced with Tailwind CSS
 *
 * This configuration maps Mantine color names to Tailwind CSS variables.
 * All colors are automatically synced - when you update colors in globals.css,
 * Mantine components will automatically use the updated colors.
 *
 * The colors are defined in src/app/globals.css using CSS variables:
 * - --{color}-{shade} (e.g., --blue-500, --gray-100)
 *
 * To add a new color:
 * 1. Add the color variables to globals.css in the :root selector
 * 2. Add the corresponding mapping below
 * 3. Optionally add dark mode variants in @media (prefers-color-scheme: dark)
 */

/**
 * Helper function to create a color tuple from Tailwind CSS variables
 * @param colorName - The color name (e.g., "blue", "gray")
 * @returns MantineColorsTuple with Tailwind CSS variables
 */
const createColorTuple = (colorName: string): MantineColorsTuple =>
    [
        `var(--${colorName}-50)`,
        `var(--${colorName}-100)`,
        `var(--${colorName}-200)`,
        `var(--${colorName}-300)`,
        `var(--${colorName}-400)`,
        `var(--${colorName}-500)`,
        `var(--${colorName}-600)`,
        `var(--${colorName}-700)`,
        `var(--${colorName}-800)`,
        `var(--${colorName}-900)`,
    ] as MantineColorsTuple;

export const mantineColors = {
    // Core colors - synced with Tailwind CSS variables from globals.css
    blue: createColorTuple("blue"),
    gray: createColorTuple("gray"),
    red: createColorTuple("red"),
    green: createColorTuple("green"),
    yellow: createColorTuple("yellow"),
    brand: createColorTuple("brand"),

    // Note: Mantine also supports other default colors (dark, indigo, cyan, etc.)
    // If you need them, add the corresponding variables to globals.css and map them here
    // Example:
    // indigo: createColorTuple("indigo"),
    // cyan: createColorTuple("cyan"),
} as const;
