import { useQuery } from "@tanstack/react-query";
import { apiAccounts } from "./api";
import { AccountsParams } from "./type";

export const useAccountsQuery = (params?: AccountsParams) => {
    return useQuery({
        queryKey: ["accounts", params],
        queryFn: () => apiAccounts.list(params),
    });
};
