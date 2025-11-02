import { axiosInstant } from "@/core/config";
import { DepositRequestResponse, DepositRequestPayload } from "./type";

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
};
