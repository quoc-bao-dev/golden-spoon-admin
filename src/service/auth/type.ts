import { AxiosError } from "axios";

export type AuthUser = {
    email: string;
    full_name: string;
    id: string;
    is_role: string;
    avatar_url: string;
    balance: string;
};

export type AuthResponse = {
    access_token: string;
    token_type: string;
    user: AuthUser;
};

export type LoginResponse = {
    data: AuthResponse;
    message: string;
};

export type UserResponse = {
    data: AuthUser;
    message: string;
};
