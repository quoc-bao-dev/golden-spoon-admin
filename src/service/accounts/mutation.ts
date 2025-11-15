import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MutationCallbacks } from "@/core/types/mutation";
import { apiAccounts } from "./api";
import {
    CreateAccountPayload,
    CreateAccountResponse,
    AccountLoginResponse,
    AccountSyncResponse,
    UpdateAccountPayload,
    UpdateAccountResponse,
    DeleteAccountResponse,
} from "./type";

export const useCreateAccountMutation = ({
    onSuccess,
    onError,
    skipInvalidate = false,
}: MutationCallbacks<CreateAccountResponse> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<CreateAccountResponse, AxiosError, CreateAccountPayload>(
        {
            mutationFn: apiAccounts.create,
            onSuccess: (data) => {
                onSuccess?.(data);
                if (!skipInvalidate) {
                    queryClient.invalidateQueries({ queryKey: ["accounts"] });
                }
            },
            onError: (error) => {
                onError?.(error);
            },
        }
    );
};

export const useDeleteAccountMutation = ({
    onSuccess,
    onError,
    skipInvalidate = false,
}: MutationCallbacks<DeleteAccountResponse> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<DeleteAccountResponse, AxiosError, string>({
        mutationFn: apiAccounts.delete,
        onSuccess: (data) => {
            onSuccess?.(data);
            if (!skipInvalidate) {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
            }
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

export const useLoginAccountMutation = ({
    onSuccess,
    onError,
    skipInvalidate = false,
}: MutationCallbacks<AccountLoginResponse> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<AccountLoginResponse, AxiosError, string>({
        mutationFn: apiAccounts.login,
        onSuccess: (data) => {
            onSuccess?.(data);
            if (!skipInvalidate) {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
            }
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

export const useSyncAccountMutation = ({
    onSuccess,
    onError,
    skipInvalidate = false,
}: MutationCallbacks<AccountSyncResponse> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<AccountSyncResponse, AxiosError, string>({
        mutationFn: apiAccounts.sync,
        onSuccess: (data) => {
            onSuccess?.(data);
            if (!skipInvalidate) {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
            }
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};

export const useUpdateAccountMutation = ({
    onSuccess,
    onError,
    skipInvalidate = false,
}: MutationCallbacks<UpdateAccountResponse> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<UpdateAccountResponse, AxiosError, UpdateAccountPayload>(
        {
            mutationFn: apiAccounts.update,
            onSuccess: (data) => {
                onSuccess?.(data);
                if (!skipInvalidate) {
                    queryClient.invalidateQueries({ queryKey: ["accounts"] });
                }
            },
            onError: (error) => {
                onError?.(error);
            },
        }
    );
};
