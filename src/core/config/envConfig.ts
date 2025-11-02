export type EnvConfig = {
    apiBaseUrl: string;
};

export const envConfig: EnvConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
