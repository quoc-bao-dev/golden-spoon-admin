"use client";

import { MainLayout } from "@/core/components";
import AuthGraund from "@/module/auth/components/AuthGraund";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <AuthGraund>
            <MainLayout>{children}</MainLayout>
        </AuthGraund>
    );
};

export default Layout;
