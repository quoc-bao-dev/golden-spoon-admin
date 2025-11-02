import { axiosInstant } from "@/core/config";
import { LoginResponse, UserResponse } from "./type";

export const apiAuth = {
    loginWithFireBase: async (firebaseToken: string) => {
        const response = await axiosInstant.post<LoginResponse>("auth/login", {
            id_token: firebaseToken,
        });
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstant.post("auth/logout");
        return response.data;
    },

    getUserInfo: async () => {
        const response = await axiosInstant.get<UserResponse>("users/me");
        return response.data;
    },
};
