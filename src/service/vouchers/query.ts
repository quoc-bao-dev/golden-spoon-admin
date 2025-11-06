import { useQuery } from "@tanstack/react-query";
import { apiVouchers } from "./api";
import { VouchersParams, MyOffersParams } from "./type";

export const useVouchersQuery = (params?: VouchersParams) => {
    return useQuery({
        queryKey: ["vouchers", params],
        queryFn: () => apiVouchers.list(params),
    });
};

export const useMyOffersQuery = (params?: MyOffersParams) => {
    return useQuery({
        queryKey: ["vouchers", "my-offers", params],
        queryFn: () => apiVouchers.myOffers(params),
    });
};
