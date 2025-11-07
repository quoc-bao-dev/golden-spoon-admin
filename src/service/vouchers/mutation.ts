import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MutationCallbacks } from "@/core/types/mutation";
import { apiVouchers } from "./api";
import { VoucherSyncResponse } from "./type";

export const useSyncVoucherMutation = ({
    onSuccess,
    onError,
    skipInvalidate = false,
}: MutationCallbacks<VoucherSyncResponse> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<VoucherSyncResponse, AxiosError, string>({
        mutationFn: apiVouchers.sync,
        onSuccess: (data) => {
            onSuccess?.(data);
            if (!skipInvalidate) {
                queryClient.invalidateQueries({ queryKey: ["vouchers"] });
            }
        },
        onError: (error) => {
            onError?.(error);
        },
    });
};
