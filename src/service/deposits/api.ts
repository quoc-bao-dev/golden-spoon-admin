import { axiosInstant } from "@/core/config";
import {
    DepositRequestResponse,
    DepositRequestPayload,
    DepositHistoryParams,
    DepositHistoryResponse,
} from "./type";

export const apiDeposits = {
    request: async (params?: DepositRequestPayload) => {
        const response = await axiosInstant.get<DepositRequestResponse>(
            "deposits/request",
            {
                params,
            }
        );
        return response.data;
    },

    history: async (params?: DepositHistoryParams) => {
        const response = await axiosInstant.get<DepositHistoryResponse>(
            "deposits/history",
            { params }
        );
        return response.data;
    },
};
