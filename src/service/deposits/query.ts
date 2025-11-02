import { useQuery } from "@tanstack/react-query";
import { apiDeposits } from "./api";
import { DepositRequestPayload } from "./type";

export const useDepositRequestQuery = (params?: DepositRequestPayload) => {
    return useQuery({
        queryKey: ["deposits", "request", params],
        queryFn: () => apiDeposits.request(params),
    });
};
