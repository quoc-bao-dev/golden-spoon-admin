"use client";

import { Icon, ImageCmp } from "@/core/components/ui";
import { formatCurrencyVND } from "@/core/components/ui/datatable/hooks";
import { _Image } from "@/core/const";
import { useAuthAction, useAuthStore } from "@/module/auth";
import {
    ActionIcon,
    AppShell,
    Box,
    NavLink,
    ScrollArea,
    Text,
    Tooltip,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { logoutAction } = useAuthAction();

    const handleLogout = () => {
        logoutAction();
    };

    const sidebarSections: {
        title: string;
        items: {
            label: string;
            href: string;
            icon: keyof typeof import("@/core/const")._Icon;
            isUnderDevelopment?: boolean;
        }[];
    }[] = [
        {
            title: "Tổng quan",
            items: [
                {
                    label: "Dashboard",
                    href: "/",
                    icon: "icon-sidebar-2",
                    isUnderDevelopment: true,
                },
                {
                    label: "Dịch vụ",
                    href: "/services",
                    icon: "icon-sidebar-5",
                },
                {
                    label: "Quản lý tài khoản",
                    href: "/account-management",
                    icon: "icon-sidebar-6",
                },
            ],
        },
        {
            title: "Tiện ích",
            items: [
                { label: "Nạp tiền", href: "/topup", icon: "icon-sidebar-3" },
                {
                    label: "Bảng giá dịch vụ",
                    href: "#",
                    icon: "icon-sidebar-4",
                    isUnderDevelopment: true,
                },
                {
                    label: "Lịch sử giao dịch",
                    href: "/transaction-history",
                    icon: "icon-sidebar-1",
                },
            ],
        },
    ];

    return (
        <AppShell
            navbar={{
                width: collapsed ? 80 : 280,
                breakpoint: "sm",
                collapsed: { mobile: true },
            }}
            padding="md"
            withBorder={false}
            className="bg-[#f7f7f7]"
            layout="alt"
        >
            <AppShell.Navbar className="bg-white p-4 flex flex-col">
                <Box
                    className={`flex items-center mb-4 ${
                        collapsed
                            ? "justify-center flex-col gap-2"
                            : "justify-between"
                    }`}
                >
                    {!collapsed && (
                        <ImageCmp src="logo" width={169} className="" />
                    )}
                    {collapsed && (
                        <ImageCmp src="logo-symbol" width={32} className="" />
                    )}
                    <ActionIcon
                        variant="subtle"
                        onClick={() => setCollapsed(!collapsed)}
                        className="hover:bg-gray-100 rounded-lg"
                        size="lg"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-transform duration-200 ${
                                collapsed ? "rotate-180" : ""
                            }`}
                        >
                            <path
                                d="M12.5 5L7.5 10L12.5 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </ActionIcon>
                </Box>
                <ScrollArea className="flex-1">
                    <Box py={"lg"}>
                        {sidebarSections.map((section) => (
                            <Box key={section.title} mb="lg">
                                {!collapsed && (
                                    <Text
                                        fw={600}
                                        mb="xs"
                                        size={"sm"}
                                        c={"gray.4"}
                                    >
                                        {section.title}
                                    </Text>
                                )}
                                {section.items.map((item) => {
                                    const isActive =
                                        item.href === "#"
                                            ? false
                                            : pathname === item.href;
                                    return (
                                        <Box
                                            key={item.label}
                                            mb={"xs"}
                                            className={
                                                collapsed
                                                    ? "flex justify-center"
                                                    : ""
                                            }
                                        >
                                            {collapsed ? (
                                                <Tooltip
                                                    label={item.label}
                                                    position="right"
                                                    withArrow
                                                    offset={10}
                                                >
                                                    <Box
                                                        component={Link}
                                                        href={item.href}
                                                        onClick={
                                                            item.isUnderDevelopment
                                                                ? (e) =>
                                                                      e.preventDefault()
                                                                : undefined
                                                        }
                                                        className={`flex justify-center items-center w-12 h-12 rounded-xl hover:bg-gray-100 ${
                                                            isActive
                                                                ? "bg-[#E67700]/10"
                                                                : ""
                                                        } ${
                                                            item.isUnderDevelopment
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : "cursor-pointer"
                                                        }`}
                                                    >
                                                        <Icon
                                                            icon={item.icon}
                                                            size={24}
                                                            mode="dynamic"
                                                            className={
                                                                isActive
                                                                    ? "text-[#E67700]"
                                                                    : "text-gray-600"
                                                            }
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <NavLink
                                                    active={isActive}
                                                    component={Link}
                                                    href={item.href}
                                                    label={item.label}
                                                    leftSection={
                                                        <Icon
                                                            mode="dynamic"
                                                            icon={item.icon}
                                                            size={24}
                                                        />
                                                    }
                                                    color="#E67700"
                                                    c={
                                                        isActive
                                                            ? "#E67700"
                                                            : "gray.6"
                                                    }
                                                    disabled={
                                                        item.isUnderDevelopment
                                                    }
                                                    onClick={
                                                        item.isUnderDevelopment
                                                            ? (e) =>
                                                                  e.preventDefault()
                                                            : undefined
                                                    }
                                                    className={`hover:bg-gray-100 rounded-xl p-2 text-gray-400 active:bg-gray-600 font-semibold! ${
                                                        item.isUnderDevelopment
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                </ScrollArea>
                <Box
                    className={`flex items-center ${
                        collapsed ? "flex-col gap-2 justify-center" : "gap-2"
                    }`}
                >
                    {collapsed ? (
                        <Tooltip
                            label={
                                <Box>
                                    <Text fw={600} size="sm">
                                        {user?.full_name}
                                    </Text>
                                    <Text size="xs" c="gray.5">
                                        {user?.email}
                                    </Text>
                                </Box>
                            }
                            position="right"
                            withArrow
                            offset={10}
                        >
                            <Image
                                src={user?.avatar_url || _Image.avatar}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-[#FFD479] object-cover cursor-pointer"
                            />
                        </Tooltip>
                    ) : (
                        <Image
                            src={user?.avatar_url || _Image.avatar}
                            alt="User Avatar"
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-[#FFD479] object-cover"
                        />
                    )}
                    {!collapsed && (
                        <>
                            <Box className="flex flex-col flex-1 min-w-0">
                                <Tooltip
                                    label={user?.full_name}
                                    position="right"
                                    withArrow
                                    offset={10}
                                >
                                    <Text fw={700} size="md" lh={1.1} truncate>
                                        {user?.full_name}
                                    </Text>
                                </Tooltip>
                                <Tooltip
                                    label={user?.email}
                                    position="right"
                                    withArrow
                                    offset={10}
                                >
                                    <Text c="gray.5" size="xs" truncate>
                                        {user?.email}
                                    </Text>
                                </Tooltip>
                                <Box className="flex items-center gap-2 mt-1">
                                    <Icon icon="icon-wallet" size={22} />
                                    <Text fw={600} c="#F59F00" size="sm">
                                        {user?.balance
                                            ? formatCurrencyVND(
                                                  Number(user.balance) || 0
                                              )
                                            : "0 đ"}
                                    </Text>
                                </Box>
                            </Box>
                            <Box
                                className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <Icon
                                    icon="icon-logout"
                                    size={24}
                                    className="cursor-pointer "
                                />
                            </Box>
                        </>
                    )}
                    {collapsed && (
                        <Tooltip
                            label="Đăng xuất"
                            position="right"
                            withArrow
                            offset={10}
                        >
                            <Box
                                className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full"
                                onClick={handleLogout}
                            >
                                <Icon
                                    icon="icon-logout"
                                    size={24}
                                    className="cursor-pointer "
                                />
                            </Box>
                        </Tooltip>
                    )}
                </Box>
            </AppShell.Navbar>

            <AppShell.Main className="h-screen ">
                <Box className="bg-white p-4 rounded-xl h-full container mx-auto">
                    {children}
                </Box>
            </AppShell.Main>
        </AppShell>
    );
};
