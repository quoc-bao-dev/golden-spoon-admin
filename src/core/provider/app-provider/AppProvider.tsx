import { PropsWithChildren } from "react";
import { CustomToaster } from "@/core/components/ui";
import { Mantine } from "../mantine-provider/MantineProvider";
import { QueryProvider } from "../query-provider";

export const AppProvider = ({ children }: PropsWithChildren) => {
    return (
        <QueryProvider>
            <Mantine>
                {children}
                <CustomToaster />
            </Mantine>
        </QueryProvider>
    );
};
