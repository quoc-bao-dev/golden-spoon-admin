"use client";

import { tokenManager } from "@/core/config";
import { apiAuth } from "@/service/auth/api";
import { AuthUser } from "@/service/auth/type";
import { useRouter } from "next/navigation";
import { create } from "zustand";

type AuthState = {
    user: AuthUser | null;
    isLoggedIn: boolean;
};
type AuthActions = {
    login: (user: AuthUser) => void;
    logout: () => void;
};

type AuthStore = AuthState & AuthActions;
export const useAuthStore = create<AuthStore>((set) => {
    const login = (user: AuthUser) => {
        set({ user, isLoggedIn: true });
    };
    const logout = () => {
        tokenManager.remove();
        set({ user: null, isLoggedIn: false });
    };
    return {
        user: null,
        isLoggedIn: false,
        login,
        logout,
    };
});

export const useAuthAction = () => {
    const router = useRouter();
    const { login, logout } = useAuthStore();
    const loginAction = (user: AuthUser) => {
        router.push("/transaction-history");
        login(user);
    };
    const logoutAction = async () => {
        await apiAuth.logout();
        logout();
        router.push("/login");
    };
    return { loginAction, logoutAction };
};
