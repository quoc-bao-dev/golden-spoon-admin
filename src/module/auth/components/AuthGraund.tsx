"use client";

import AppLoading from "@/core/components/ui/AppLoading";
import { useGetUserInfoMutation } from "@/service/auth/mutation";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useAuthStore } from "../store";

const AuthGraund = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    const { isLoggedIn, logout } = useAuthStore();
    const hasCheckedRef = useRef(false);

    const { mutateAsync: getUserInfo, isPending } = useGetUserInfoMutation({
        onSuccess: () => {
            // User info loaded successfully, auth store will be updated by mutation
        },
        onError: () => {
            // Token invalid or expired, logout and redirect
            logout();
            router.push("/login");
        },
    });

    useEffect(() => {
        // Check auth on mount if not logged in (only once)
        if (!hasCheckedRef.current && !isLoggedIn) {
            hasCheckedRef.current = true;
            getUserInfo().catch(() => {
                // Error handled in onError callback
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Show skeleton while checking auth
    if (isPending) {
        return (
            // <AppShell
            //     navbar={{
            //         width: 260,
            //         breakpoint: "sm",
            //         collapsed: { mobile: true },
            //     }}
            //     padding="md"
            //     withBorder={false}
            //     className="bg-[#F5F7FB]"
            //     layout="alt"
            // >
            //     <AppShell.Navbar className="bg-white p-4">
            //         <Box mb="lg">
            //             <Skeleton height={50} width={169} radius="md" />
            //         </Box>
            //         <Stack gap="lg">
            //             <Box>
            //                 <Skeleton
            //                     height={16}
            //                     width={80}
            //                     radius="md"
            //                     mb="xs"
            //                 />
            //                 <Stack gap="xs">
            //                     <Skeleton
            //                         height={40}
            //                         width="100%"
            //                         radius="md"
            //                     />
            //                     <Skeleton
            //                         height={40}
            //                         width="100%"
            //                         radius="md"
            //                     />
            //                     <Skeleton
            //                         height={40}
            //                         width="100%"
            //                         radius="md"
            //                     />
            //                 </Stack>
            //             </Box>
            //             <Box>
            //                 <Skeleton
            //                     height={16}
            //                     width={80}
            //                     radius="md"
            //                     mb="xs"
            //                 />
            //                 <Stack gap="xs">
            //                     <Skeleton
            //                         height={40}
            //                         width="100%"
            //                         radius="md"
            //                     />
            //                     <Skeleton
            //                         height={40}
            //                         width="100%"
            //                         radius="md"
            //                     />
            //                     <Skeleton
            //                         height={40}
            //                         width="100%"
            //                         radius="md"
            //                     />
            //                 </Stack>
            //             </Box>
            //         </Stack>
            //         <Box className="flex items-center gap-2 mt-auto pt-4">
            //             <Skeleton height={48} width={48} radius="50%" />
            //             <Box className="flex flex-col flex-1 min-w-0 gap-1">
            //                 <Skeleton height={16} width={120} radius="md" />
            //                 <Skeleton height={12} width={150} radius="md" />
            //                 <Skeleton height={14} width={100} radius="md" />
            //             </Box>
            //             <Skeleton height={40} width={40} radius="md" />
            //         </Box>
            //     </AppShell.Navbar>

            //     <AppShell.Main className="h-screen">
            //         <Box className="bg-white p-4 rounded-xl h-full">
            //             <Stack gap="md">
            //                 <Skeleton height={50} width="100%" radius="md" />
            //                 <Skeleton height={200} width="100%" radius="md" />
            //                 <Skeleton height={100} width="100%" radius="md" />
            //                 <Skeleton height={100} width="80%" radius="md" />
            //             </Stack>
            //         </Box>
            //     </AppShell.Main>
            // </AppShell>
            <AppLoading />
        );
    }

    // If not logged in after check, redirect will happen
    if (!isLoggedIn) {
        return null; // Will redirect in onError callback
    }

    // User is authenticated, render MainLayout
    return <>{children}</>;
};

export default AuthGraund;
