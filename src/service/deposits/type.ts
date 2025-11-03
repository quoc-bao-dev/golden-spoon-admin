export type BankInfo = {
    account_owner: string;
    account_number: string;
    bank_name: string;
    transfer_content: string;
    qr_code_url: string;
};

export type DepositRequestData = {
    status: string;
    id: string;
    transaction_type: string;
    bank_info: BankInfo;
};

export type DepositRequestResponse = {
    data: DepositRequestData;
    message: string;
};

export type DepositRequestPayload = {
    amount?: number;
    [key: string]: any;
};

export type DepositHistoryItem = {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    [key: string]: any;
};

export type DepositHistoryParams = {
    page?: number;
    limit?: number;
    [key: string]: any;
};

export type DepositHistoryResponse = {
    data: {
        items: DepositHistoryItem[];
        page: number;
        limit: number;
        total: number;
    };
    message: string;
};
