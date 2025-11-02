import { PropsWithChildren } from "react";
import { Mantine } from "../mantine-provider/MantineProvider";
import { QueryProvider } from "../query-provider";

export const AppProvider = ({ children }: PropsWithChildren) => {
    return (
        <QueryProvider>
            <Mantine>{children}</Mantine>
        </QueryProvider>
    );
};
