import { axiosInstant } from "@/core/config";
import {
    VouchersParams,
    VouchersResponse,
    MyOffersParams,
    MyOffersResponse,
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
};
