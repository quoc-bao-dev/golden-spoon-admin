import { LoginPage } from "@/module/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng nhập",
    description: "Đăng nhập vào hệ thống",
};

const Page = () => {
    return <LoginPage />;
};

export default Page;
