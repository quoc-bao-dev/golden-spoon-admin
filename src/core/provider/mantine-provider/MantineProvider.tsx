import { MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";
import { mantineTheme } from "../../theme";

export const Mantine = ({ children }: PropsWithChildren) => {
    return (
        <MantineProvider
            theme={mantineTheme}
            defaultColorScheme="light"
            forceColorScheme="light"
        >
            {children}
        </MantineProvider>
    );
};
