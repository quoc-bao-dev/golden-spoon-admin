export type AccountAuthStatus =
    | "active"
    | "inactive"
    | "locked"
    | "login_failed";

export type AccountItem = {
    id: string;
    customer_id: string | null;
    customer_number: string | null;
    full_name: string | null;
    email: string | null;
    email_verified: boolean;
    password: string;
    phone_number: string;
    coin_amount: number | null;
    membership_tier: number;
    membership_name?: string;
    auth_status: AccountAuthStatus;
    token_expires: string | null;
    created_at: string;
    updated_at: string;
    last_sync_at: string;
    gender?: number | null;
    date_of_birth?: string | null;
    join_date?: string | null;
    address?: string | null;
};

export type AccountsParams = {
    page?: number;
    limit?: number; // server expects page_size
    search?: string; // phone, email, full_name, or customer_number
    status?: AccountAuthStatus; // active | inactive | locked | login_failed
};

export type AccountsResponse = {
    code: number;
    message: string;
    data: {
        items: AccountItem[];
        total: number;
        page: number;
        page_size: number;
        total_pages: number;
    };
    error: null;
};

export type CreateAccountPayload = {
    password: string;
    phone_number: string;
};

export type CreateAccountError = {
    type: string;
    detail: string;
};

export type CreateAccountResponse = {
    code: number;
    message: string;
    data: {
        success: boolean;
        account: AccountItem;
    } | null;
    error: CreateAccountError | null;
};

export type AccountLoginError = {
    type: string;
    detail: string;
};

export type AccountLoginResponse = {
    code: number;
    message: string;
    data: {
        success: boolean;
        account_id: string;
    } | null;
    error: AccountLoginError | null;
};

export type AccountSyncError = {
    type: string;
    detail: string;
};

export type AccountSyncResponse = {
    code: number;
    message: string;
    data: {
        success: boolean;
        account: AccountItem;
    } | null;
    error: AccountSyncError | null;
};

export type UpdateAccountPayload = {
    id: string; // account id
    password?: string;
};

export type UpdateAccountError = {
    type: string;
    detail: string;
};

export type UpdateAccountResponse = {
    code: number;
    message: string;
    data: {
        success: boolean;
        account: AccountItem;
    } | null;
    error: UpdateAccountError | null;
};

export type DeleteAccountError = {
    type: string;
    detail: string;
};

export type DeleteAccountResponse = {
    code: number;
    message: string;
    data: {
        success: boolean;
        account_id: string;
    } | null;
    error: DeleteAccountError | null;
};

export type ApiErrorDetail = {
    type: string;
    loc: string[];
    msg: string;
    input?: string;
    ctx?: Record<string, unknown>;
};

export type ApiErrorResponse = {
    detail: ApiErrorDetail[];
};
