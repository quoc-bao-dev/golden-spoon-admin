import { Button } from "@mantine/core";
import { Icon, showErrorToast, showSuccessToast } from "@/core/components/ui";
import { useSyncAccountMutation } from "@/service/accounts";

type AccountActionsBarProps = {
    searchValue: string;
    filteredCount: number;
    selectedCount: number;
    selectedIds: string[];
    onDelete: () => void;
    onLogin: () => void;
    isDeleting?: boolean;
    isLoggingIn?: boolean;
};

export const AccountActionsBar = ({
    searchValue,
    filteredCount,
    selectedCount,
    selectedIds,
    onDelete,
    onLogin,
    isDeleting,
    isLoggingIn,
}: AccountActionsBarProps) => {
    const { mutateAsync: syncAccount, isPending: isSyncing } =
        useSyncAccountMutation();

    const handleSync = async () => {
        if (!selectedIds || selectedIds.length === 0) return;
        const results = await Promise.all(
            selectedIds.map((id) => syncAccount(id))
        );
        const success = results.filter((r) => Boolean(r)).length;
        const fail = results.length - success;
        if (success > 0)
            showSuccessToast(`Đồng bộ thành công ${success} tài khoản`);
        if (fail > 0) showErrorToast(`Đồng bộ thất bại ${fail} tài khoản`);
    };
    return (
        <div className="flex items-center justify-between gap-4 min-h-[48px]">
            <div className="flex gap-4">
                {/* Search Results Info */}
                {searchValue && (
                    <div className="mb-2 text-sm text-gray-400">
                        Tìm thấy{" "}
                        <span className="text-gray-700">{filteredCount}</span>{" "}
                        kết quả cho "
                        <span className="text-gray-700">{searchValue}</span>"
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
                        leftSection={<Icon icon="icon-update" size={16} />}
                        onClick={handleSync}
                        loading={isSyncing}
                        disabled={isDeleting || isLoggingIn}
                    >
                        Đồng bộ tin tài khoản
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        leftSection={<Icon icon="icon-user-search" size={16} />}
                        disabled={isDeleting || isLoggingIn || isSyncing}
                    >
                        Kiểm tra tài khoản
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        leftSection={<Icon icon="icon-trash" size={16} />}
                        onClick={onDelete}
                        loading={isDeleting}
                        disabled={isSyncing || isLoggingIn}
                    >
                        Xóa tài khoản
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        leftSection={<Icon icon="icon-login" size={16} />}
                        onClick={onLogin}
                        loading={isLoggingIn}
                        disabled={isDeleting || isSyncing}
                    >
                        Đăng nhập
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AccountActionsBar;
