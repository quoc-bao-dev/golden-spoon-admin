export type Brand = {
    id: string;
    title: string;
    logo_file_name: string;
    logo_id: string;
    feature_image_file_name: string;
};

export type VoucherItem = {
    title: string;
    denomination_value: number;
    valid_from_date: string;
    expiry_date: string;
    id: string;
    account_customer_id: string;
    exchange_qr_code: string;
    post_id: string;
    exchange_voucher_type: string | null;
    internal_status: string;
    brands: Brand[];
    exchange_date: string;
    synced_at: string;
    created_at: string;
    account_phone: string | null;
    account_name: string | null;
};

export type VouchersParams = {
    page?: number;
    page_size?: number;
    sort?: "newest" | "oldest" | string;
};

export type VouchersResponse = {
    data: {
        total: number;
        page: number;
        page_size: number;
        vouchers: VoucherItem[];
    };
    message: string;
};

export type GroupVoucherLite = {
    id: string;
    exchange_qr_code: string;
    account_customer_id: string;
    valid_from_date: string;
    expiry_date: string;
    exchange_voucher_type: string | null;
    internal_status: string;
    synced_at: string;
    created_at: string;
};

export type GroupBrand = {
    id: string;
    title: string;
    logo_id: string;
    logo_file_name: string;
    feature_id: string;
    feature_image_file_name: string;
};

export type VoucherGroup = {
    post_id: string;
    title: string;
    denomination_value: number;
    quantity: number;
    brands: GroupBrand[];
    vouchers: GroupVoucherLite[];
};

export type MyOffersParams = {
    page?: number;
    page_size?: number;
    sort?: "newest" | "oldest" | string;
};

export type MyOffersResponse = {
    data: {
        total: number;
        page: number;
        page_size: number;
        groups: VoucherGroup[];
    };
    message: string;
};
