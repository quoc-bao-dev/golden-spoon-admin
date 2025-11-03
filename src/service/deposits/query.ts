import { useQuery } from "@tanstack/react-query";
import { apiDeposits } from "./api";
import { DepositRequestPayload, DepositHistoryParams } from "./type";

export const useDepositRequestQuery = (params?: DepositRequestPayload) => {
    return useQuery({
        queryKey: ["deposits", "request", params],
        queryFn: () => apiDeposits.request(params),
    });
};

export const useDepositHistoryQuery = (params?: DepositHistoryParams) => {
    return useQuery({
        queryKey: ["deposits", "history", params],
        queryFn: () => apiDeposits.history(params),
    });
};
