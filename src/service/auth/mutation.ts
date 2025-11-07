import { showErrorToast } from "@/core/components/ui/Toast";
import { tokenManager } from "@/core/config";
import {
    MutationCallbacks,
    MutationCallbacksFromOptions,
} from "@/core/types/mutation";
import { useAuthStore } from "@/module/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiAuth } from "./api";
import { AuthResponse, LoginResponse, UserResponse } from "./type";

export const useLoginMuatation = ({
    onSuccess,
    onError,
}: MutationCallbacks<LoginResponse> = {}) => {
    const { login } = useAuthStore();
    return useMutation({
        mutationFn: apiAuth.loginWithFireBase,
        onSuccess: (data) => {
            if (data.message === "Login unsuccessful") {
                showErrorToast(data.message);
                return;
            }

            onSuccess?.(data);
            login(data.data.user);

            tokenManager.set(data.data.access_token);
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                onError?.(error);
            }
        },
    });
};

export const useGetUserInfoMutation = ({
    onSuccess,
    onError,
    onMutate,
    onSettled,
}: MutationCallbacksFromOptions<UserResponse> = {}) => {
    const { login } = useAuthStore();
    return useMutation({
        mutationFn: apiAuth.getUserInfo,
        onSuccess: (data) => {
            onSuccess?.(data);
            login(data.data);
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                onError?.(error);
            }
        },
        onMutate: (variables) => {
            onMutate?.(variables);
        },
        onSettled: (data, error) => {
            if (onSettled) {
                onSettled(data, error);
            }
        },
    });
};
