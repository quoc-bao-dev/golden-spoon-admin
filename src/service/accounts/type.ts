export type AccountAuthStatus =
    | "active"
    | "inactive"
    | "locked"
    | "login_failed";

export type AccountItem = {
    id: string;
    customer_id: string;
    customer_number: string;
    full_name: string;
    email: string;
    email_verified: boolean;
    password: string;
    phone_number: string;
    coin_amount: string;
    membership_tier: number;
    auth_status: AccountAuthStatus;
    created_at: string;
    updated_at: string;
    last_sync_at: string;
};

export type AccountsParams = {
    page?: number;
    limit?: number;
    [key: string]: any;
};

export type AccountsResponse = {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    accounts: AccountItem[];
};

export type CreateAccountPayload = {
    password: string;
    phone_number: string;
};

export type CreateAccountResponse = AccountItem;

export type AccountLoginResponse = {
    message?: string;
};

export type AccountSyncResponse = {
    message?: string;
};
