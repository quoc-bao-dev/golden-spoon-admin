import { axiosInstant } from "@/core/config";
import {
    AccountsParams,
    AccountsResponse,
    CreateAccountPayload,
    CreateAccountResponse,
    AccountLoginResponse,
    AccountSyncResponse,
    UpdateAccountPayload,
    UpdateAccountResponse,
    DeleteAccountResponse,
} from "./type";

export const apiAccounts = {
    list: async (params?: AccountsParams) => {
        const response = await axiosInstant.get<AccountsResponse>("accounts", {
            params,
        });
        return response.data;
    },

    create: async (payload: CreateAccountPayload) => {
        const response = await axiosInstant.post<CreateAccountResponse>(
            "accounts",
            payload
        );
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axiosInstant.delete<DeleteAccountResponse>(
            `accounts/${id}`
        );
        return response.data;
    },

    login: async (id: string) => {
        const response = await axiosInstant.post<AccountLoginResponse>(
            `accounts/${id}/login`
        );
        return response.data;
    },

    sync: async (id: string) => {
        const response = await axiosInstant.post<AccountSyncResponse>(
            `accounts/${id}/sync`
        );
        return response.data;
    },

    update: async ({ id, ...data }: UpdateAccountPayload) => {
        const response = await axiosInstant.put<UpdateAccountResponse>(
            `accounts/${id}`,
            data
        );
        return response.data;
    },
};
