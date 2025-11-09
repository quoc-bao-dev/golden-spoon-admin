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
    page?: number; // Default: 1, Minimum: 1
    page_size?: number; // Default: 20, Minimum: 1, Maximum: 100
    search?: string; // Search by title
    min_value?: number; // Min voucher value
    max_value?: number; // Max voucher value
    account_id?: string; // Filter by account
    sort?: "newest" | "price_asc" | "price_desc" | "expiry_soon" | string; // Default: "newest"
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
    page?: number; // Default: 1, Minimum: 1
    page_size?: number; // Default: 20, Minimum: 1, Maximum: 100
    search?: string; // Search by title
    sort?: "newest" | "price_asc" | "price_desc" | "expiry_soon" | string; // Default: "newest"
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

export type VoucherSyncResponse = {
    message?: string;
};

export type ClaimVoucherPayload = {
    account_customer_id: string;
};

export type ClaimVoucherResponse = {
    message?: string;
    data?: unknown;
};
