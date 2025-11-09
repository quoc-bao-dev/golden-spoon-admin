import { axiosInstant } from "@/core/config";
import {
    VouchersParams,
    VouchersResponse,
    MyOffersParams,
    MyOffersResponse,
    VoucherSyncResponse,
    ClaimVoucherPayload,
    ClaimVoucherResponse,
} from "./type";

export const apiVouchers = {
    list: async (params?: VouchersParams) => {
        const response = await axiosInstant.get<VouchersResponse>("vouchers", {
            params,
        });
        return response.data;
    },

    myOffers: async (params?: MyOffersParams) => {
        const response = await axiosInstant.get<MyOffersResponse>(
            "vouchers/my-offers",
            { params }
        );
        return response.data;
    },

    sync: async (id: string) => {
        const response = await axiosInstant.post<VoucherSyncResponse>(
            `vouchers/sync/${id}`
        );
        return response.data;
    },

    claim: async (voucherId: string, payload: ClaimVoucherPayload) => {
        const response = await axiosInstant.post<ClaimVoucherResponse>(
            `vouchers/${voucherId}/claim`,
            payload
        );
        return response.data;
    },
};
