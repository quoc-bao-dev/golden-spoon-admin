"use client";

import type { MantineThemeComponents, MantineTheme } from "@mantine/core";
import type { TextProps } from "@mantine/core";

export const textConfig: MantineThemeComponents["Text"] = {
    defaultProps: {
        // Màu text mặc định khi không chỉ định màu
        // Có thể thay đổi thành: "dark", "gray", "dimmed", hoặc bất kỳ màu nào trong theme
        // c: "dark", // Uncomment và thay đổi giá trị này để đặt màu mặc định
    },
    styles: (theme: MantineTheme, props: TextProps) => {
        // Nếu không có màu được chỉ định qua prop `c`, sử dụng màu từ CSS variable
        const defaultColor =
            props.c === undefined ? "var(--foreground)" : undefined;

        return {
            root: {
                ...(defaultColor && { color: defaultColor }),
            },
        };
    },
};
