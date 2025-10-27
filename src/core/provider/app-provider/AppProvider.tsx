import { PropsWithChildren } from "react";
import { Mantine } from "../mantine-provider/MantineProvider";

export const AppProvider = ({ children }: PropsWithChildren) => {
    return <Mantine>{children}</Mantine>;
};
