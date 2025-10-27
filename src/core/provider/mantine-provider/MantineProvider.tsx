import { MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";

export const Mantine = ({ children }: PropsWithChildren) => {
    return <MantineProvider>{children}</MantineProvider>;
};
