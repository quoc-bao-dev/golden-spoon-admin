import { Button } from "@mantine/core";
import { Icon, showErrorToast, showSuccessToast } from "@/core/components/ui";
import { useSyncAccountMutation } from "@/service/accounts";
import { useQueryClient } from "@tanstack/react-query";
import { LoginProcessBanner } from "./LoginProcessBanner";
import type { BatchResult } from "@/core/hooks/useBatchProcessor";
import type { AccountLoginResponse } from "@/service/accounts";

type AccountActionsBarProps = {
    searchValue: string;
    filteredCount: number;
    selectedCount: number;
    selectedIds: string[];
    onDelete: () => void;
    onLogin: () => void;
    onSyncVoucher: () => void;
    isDeleting?: boolean;
    isLoggingIn?: boolean;
    isSyncingVoucher?: boolean;
    processInfo?: {
        processedCount: number;
        totalCount: number;
        currentBatch: number;
        totalBatches: number;
        progress: number;
    };
    loginResults?: BatchResult<AccountLoginResponse>[];
    accountMap?: Map<string, { name: string; email: string; phone: string }>;
    onCloseBanner?: () => void;
};

export const AccountActionsBar = ({
    searchValue,
    filteredCount,
    selectedCount,
    selectedIds,
    onDelete,
    onLogin,
    onSyncVoucher,
    isDeleting,
    isLoggingIn,
    isSyncingVoucher,
    processInfo,
    loginResults,
    accountMap,
    onCloseBanner,
}: AccountActionsBarProps) => {
    const queryClient = useQueryClient();
    const { mutateAsync: syncAccount, isPending: isSyncing } =
        useSyncAccountMutation({ skipInvalidate: true });

    const handleSync = async () => {
        if (!selectedIds || selectedIds.length === 0) return;
        const results = await Promise.allSettled(
            selectedIds.map((id) => syncAccount(id))
        );

        const successResults: string[] = [];
        const failResults: string[] = [];
        console.log({ results });

        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                const response = result.value;
                if (response.code === 0) {
                    successResults.push(response.message);
                } else {
                    failResults.push(
                        response.message ||
                            `Tài khoản ${selectedIds[index]}: ${
                                response.error?.detail || "Lỗi không xác định"
                            }`
                    );
                }
            } else {
                failResults.push(
                    `Tài khoản ${selectedIds[index]}:
                     ${
                         result.reason?.response?.data?.message ||
                         "Lỗi không xác định"
                     }`
                );
            }
        });

        if (successResults.length > 0) {
            const uniqueSuccessMessages = [...new Set(successResults)];
            uniqueSuccessMessages.forEach((msg) => {
                showSuccessToast(msg);
            });
        }

        if (failResults.length > 0) {
            const uniqueFailMessages = [...new Set(failResults)];
            uniqueFailMessages.forEach((msg) => {
                showErrorToast(msg);
            });
        }

        // Invalidate once after all mutations complete
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
    };
    return (
        <div className="flex flex-col gap-2">
            {/* Top row: Info và Action Buttons */}
            <div className="flex items-center justify-between gap-4 min-h-[48px]">
                <div className="flex gap-4">
                    {/* Search Results Info */}
                    {searchValue && (
                        <div className="mb-2 text-sm text-gray-400">
                            Tìm thấy{" "}
                            <span className="text-gray-700">
                                {filteredCount}
                            </span>{" "}
                            kết quả cho "
                            <span className="text-gray-700">{searchValue}</span>
                            "
                        </div>
                    )}

                    {/* Selection Info */}
                    {selectedCount > 0 && (
                        <div className="mb-2 text-sm text-[#E67700]">
                            Đã chọn: {selectedCount}
                        </div>
                    )}
                </div>

                {selectedCount > 0 && (
                    <div className="flex gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            leftSection={<Icon icon="icon-sync" size={16} />}
                            onClick={onSyncVoucher}
                            loading={isSyncingVoucher}
                            disabled={isDeleting || isLoggingIn || isSyncing}
                        >
                            Đồng bộ voucher
                        </Button>
                        <Button
                            variant="default"
                            leftSection={<Icon icon="icon-update" size={16} />}
                            onClick={handleSync}
                            loading={isSyncing}
                            disabled={
                                isDeleting || isLoggingIn || isSyncingVoucher
                            }
                        >
                            Đồng bộ thông tin tài khoản
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            leftSection={
                                <Icon icon="icon-user-search" size={16} />
                            }
                            disabled={
                                // isDeleting ||
                                // isLoggingIn ||
                                // isSyncing ||
                                // isSyncingVoucher
                                true
                            }
                        >
                            Kiểm tra tài khoản
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            leftSection={<Icon icon="icon-trash" size={16} />}
                            onClick={onDelete}
                            loading={isDeleting}
                            disabled={
                                isSyncing || isLoggingIn || isSyncingVoucher
                            }
                        >
                            Xóa tài khoản
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            leftSection={<Icon icon="icon-login" size={16} />}
                            onClick={onLogin}
                            loading={isLoggingIn}
                            disabled={
                                isDeleting || isSyncing || isSyncingVoucher
                            }
                        >
                            Đăng nhập
                        </Button>
                    </div>
                )}
            </div>

            {/* Login Process Banner - hiển thị dưới action buttons */}
            <LoginProcessBanner
                isProcessing={isLoggingIn || false}
                processInfo={processInfo}
                results={loginResults}
                accountMap={accountMap}
                onClose={onCloseBanner}
            />
        </div>
    );
};

export default AccountActionsBar;
