import { UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type MutationCallbacks<TResponse> = {
    onSuccess?: (data: TResponse) => void;
    onError?: (error: AxiosError) => void;
    skipInvalidate?: boolean; // Skip invalidate queries (useful for batch operations)
};

// Type helper để extract 4 callbacks từ UseMutationOptions
// Với signature đơn giản - chỉ lấy tham số đầu tiên (quan trọng nhất)
export type MutationCallbacksFromOptions<
    TData,
    TError = AxiosError,
    TVariables = void
> = {
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
    onMutate?: (variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: Error | null) => void;
};
