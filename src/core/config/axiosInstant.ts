import axios, { AxiosInstance } from "axios";
import { envConfig } from "./envConfig";

export const ACCESS_TOKEN_KEY = "access_token";

export const tokenManager = {
    get: () => {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    },
    set: (token: string) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
        }
    },
    remove: () => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
    },
};

export const axiosInstant: AxiosInstance = axios.create({
    baseURL: envConfig.apiBaseUrl,
});

axiosInstant.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstant;
