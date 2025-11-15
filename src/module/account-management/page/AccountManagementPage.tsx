import {
    ColumnDef,
    DataTable,
    Icon,
    PaginationState,
    showErrorToast,
    showSuccessToast,
} from "@/core/components/ui";
import { _Image } from "@/core/const/asset/image";
import {
    useBatchProcessor,
    type BatchResult,
} from "@/core/hooks/useBatchProcessor";
import { usePreventReload } from "@/core/hooks/usePreventReload";
import type {
    AccountAuthStatus,
    AccountLoginResponse,
} from "@/service/accounts";
import {
    useAccountsQuery,
    useDeleteAccountMutation,
    useLoginAccountMutation,
} from "@/service/accounts";
import { useSyncVoucherMutation } from "@/service/vouchers";
import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Loader,
    Menu,
    Title,
    Tooltip,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { AddAccountModal } from "../components";
import AccountActionsBar from "../components/AccountActionsBar";
import AccountFilterBar from "../components/AccountFilterBar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { ProcessingInterruptedModal } from "../components/ProcessingInterruptedModal";
import UpdateAccountModal from "../components/UpdateAccountModal";

// Config: Số lượng request đăng nhập xử lý trong 1 lần (batch size)
const LOGIN_BATCH_SIZE = 3;
// Config: Delay (ms) giữa các batch (mặc định: 0)
const LOGIN_BATCH_DELAY = 0;

type AccountRow = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    phone: string;
    password: string;
    rewardPoints: number;
    status: AccountAuthStatus;
    tokenExpired?: boolean;
    avatarUrl?: string;
    isProcessing?: boolean; // Flag để hiển thị trạng thái đang xử lý
};

const AccountManagementPage = () => {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>("");
    const [page, setPage] = useSessionStorage<number>({
        key: "account-management.page",
        defaultValue: 1,
    });
    const [pageSize, setPageSize] = useSessionStorage<number>({
        key: "account-management.pageSize",
        defaultValue: 10,
    });
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [passwordVisibility, setPasswordVisibility] = useState<
        Record<string, boolean>
    >({});

    // State để track các account đang xử lý
    const [processingAccountIds, setProcessingAccountIds] = useState<
        Set<string>
    >(new Set());
    // State để lưu data từ response (optimistic update)
    const [updatedAccounts, setUpdatedAccounts] = useState<
        Map<string, Partial<AccountRow>>
    >(new Map());
    // State để lưu results sau khi xử lý xong (để hiển thị trong banner)
    const [loginResults, setLoginResults] = useState<
        BatchResult<AccountLoginResponse>[]
    >([]);
    // State để hiển thị modal cảnh báo reload
    const [showReloadWarningModal, setShowReloadWarningModal] = useState(false);

    // Reset selection when page changes
    useEffect(() => {
        setSelectedIds([]);
    }, [page]);
    const [addAccountModalOpened, setAddAccountModalOpened] = useState(false);
    const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [updateModalOpened, setUpdateModalOpened] = useState(false);
    const [editingAccount, setEditingAccount] = useState<{
        id: string;
        email: string;
        phone: string;
    } | null>(null);

    const statusOptions = [
        { key: "", value: "Tất cả" },
        { key: "active", value: "Active" },
        { key: "inactive", value: "Inactive" },
        { key: "locked", value: "Locked" },
        { key: "login_failed", value: "Login Failed" },
    ];

    const togglePasswordVisibility = (accountId: string) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [accountId]: !prev[accountId],
        }));
    };

    const formatRewardPoints = (points: number) => {
        return `${points.toLocaleString()} G-coin`;
    };

    const getStatusBadgeStyle = (
        status: AccountAuthStatus
    ): { style: { background: string; color: string }; label: string } => {
        switch (status) {
            case "active":
                return {
                    style: { background: "#E6FCF5", color: "#12B886" },
                    label: "Active",
                };
            case "inactive":
                return {
                    style: { background: "#FFF4E6", color: "#E67700" },
                    label: "Inactive",
                };
            case "locked":
                return {
                    style: { background: "#FFE5E5", color: "#E03131" },
                    label: "Blocked",
                };
            case "login_failed":
                return {
                    style: { background: "#E7F5FF", color: "#1C7ED6" },
                    label: "Login Failed",
                };
            default:
                return {
                    style: { background: "#F1F3F5", color: "#495057" },
                    label: status,
                };
        }
    };

    type Row = AccountRow;
    const columns: ColumnDef<Row>[] = [
        {
            key: "user",
            header: "User",
            className: "min-w-[240px]",
            render: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={row.avatarUrl || _Image.avatar}
                            size="md"
                            imageProps={{
                                onError: (e) => {
                                    const img =
                                        e.currentTarget as HTMLImageElement;
                                    img.onerror = null;
                                    img.src = _Image.avatar;
                                },
                            }}
                        />
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">{row.name || "-"}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                {row.email || "-"}
                                {row.emailVerified && (
                                    <Tooltip label="E-mail đã xác thực">
                                        <Box
                                            component="span"
                                            className="inline-flex items-center cursor-pointer shrink-0"
                                        >
                                            <Icon
                                                icon="icon-check-graund"
                                                size={20}
                                                className="text-green-500"
                                            />
                                        </Box>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: "phone",
            header: "Số điện thoại",
            className: "min-w-[150px]",
            render: ({ row }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>{row.phone}</span>
                        {row.tokenExpired && (
                            <Tooltip label="Token hết hạn, hãy đăng nhập lại">
                                <Box
                                    component="span"
                                    className="inline-flex items-center cursor-pointer shrink-0"
                                >
                                    <Icon
                                        icon="icon-info-red"
                                        size={16}
                                        className="text-orange-500"
                                    />
                                </Box>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            key: "password",
            header: "Mật khẩu",
            className: "min-w-[200px]",
            render: ({ row }) => {
                const isVisible = passwordVisibility[row.id];
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-mono min-w-[110px]">
                            {isVisible ? row.password : "************"}
                        </span>
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => togglePasswordVisibility(row.id)}
                        >
                            <Icon
                                icon={isVisible ? "icon-eye" : "icon-eye-close"}
                                size={18}
                            />
                        </ActionIcon>
                    </div>
                );
            },
        },
        {
            key: "rewardPoints",
            header: "Điểm thưởng",
            className: "min-w-[150px]",
            render: ({ row }) => {
                return (
                    <div className="flex items-center gap-1 whitespace-nowrap">
                        <Icon
                            icon="icon-coin"
                            size={24}
                            className="text-yellow-500 mr-2"
                        />
                        <span>{formatRewardPoints(row.rewardPoints)}</span>
                    </div>
                );
            },
        },
        {
            key: "status",
            header: "Trạng thái",
            className: "min-w-[120px]",
            render: ({ row }) => {
                // Nếu đang xử lý, hiển thị badge "Đang đăng nhập"
                if (row.isProcessing) {
                    return (
                        <Badge
                            style={{
                                background: "#E7F5FF",
                                color: "#1C7ED6",
                            }}
                            variant="light"
                            radius="md"
                            size="md"
                            className="font-normal p-3.5! rounded-2xl!"
                        >
                            <div className="flex items-center gap-2">
                                <Loader size={14} color="#1C7ED6" />
                                <span>Logging in...</span>
                            </div>
                        </Badge>
                    );
                }

                // Nếu không đang xử lý, hiển thị badge status bình thường
                const { style, label } = getStatusBadgeStyle(row.status);
                return (
                    <Badge
                        style={style}
                        variant="light"
                        size="md"
                        className="font-normal p-3.5! rounded-[8px]!"
                    >
                        {label}
                    </Badge>
                );
            },
        },
        {
            key: "actions",
            header: "Tác vụ",
            className: "min-w-[80px]",
            align: "center",
            render: ({ row }) => {
                return (
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                disabled={isLoggingIn}
                            >
                                <Icon icon="icon-menu-dot" size={20} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={
                                    <Icon icon="icon-login" size={16} />
                                }
                                onClick={() => handleLoginAccount(row.id)}
                                disabled={isLoggingIn}
                            >
                                Đăng nhập
                            </Menu.Item>
                            <Menu.Item
                                leftSection={
                                    <Icon icon="icon-pencil" size={16} />
                                }
                                onClick={() => {
                                    setEditingAccount({
                                        id: row.id,
                                        email: row.email,
                                        phone: row.phone,
                                    });
                                    setUpdateModalOpened(true);
                                }}
                                disabled={isLoggingIn}
                            >
                                Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item
                                leftSection={
                                    <Icon icon="icon-trash" size={16} />
                                }
                                color="red"
                                onClick={() => {
                                    setIdsToDelete([row.id]);
                                    setConfirmDeleteOpened(true);
                                }}
                                disabled={isDeleting || isLoggingIn}
                            >
                                Xóa tài khoản
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                );
            },
        },
    ];

    const { data: accountsData, isLoading } = useAccountsQuery({
        page,
        limit: pageSize,
        search: searchValue || undefined,
        status: statusFilter ? (statusFilter as AccountAuthStatus) : undefined,
    });

    const rows: AccountRow[] = useMemo(() => {
        if (!accountsData) return [];
        const items = accountsData?.data.items ?? [];
        return items.map((item) => {
            const accountId = String(item.id ?? "");
            const baseRow: AccountRow = {
                id: accountId,
                name: String(
                    item.full_name ?? item.full_name ?? item.email ?? ""
                ),
                email: String(item.email ?? ""),
                emailVerified: Boolean(item.email_verified ?? false),
                phone: String(item.phone_number ?? ""),
                password: item.password ?? "-",
                rewardPoints: Number(item.coin_amount ?? 0),
                status: item.auth_status,
                avatarUrl: String(
                    (item as any).avatar_url || (item as any).avatar || ""
                ),
                isProcessing: processingAccountIds.has(accountId),
            };

            // Merge data từ updatedAccounts nếu có
            const updatedData = updatedAccounts.get(accountId);
            if (updatedData) {
                return {
                    ...baseRow,
                    ...updatedData,
                    // Đảm bảo isProcessing được set đúng
                    isProcessing: processingAccountIds.has(accountId),
                };
            }

            return baseRow;
        });
    }, [accountsData, processingAccountIds, updatedAccounts]);

    const serverTotal = accountsData?.data.total;
    const apiPagination: PaginationState = {
        page,
        pageSize,
        total: serverTotal!,
    };

    const queryClient = useQueryClient();

    const { mutateAsync: deleteAccount, isPending: isDeleting } =
        useDeleteAccountMutation({ skipInvalidate: true });

    const handleDelete = async (ids?: string[]) => {
        const list = ids ?? selectedIds;
        if (list.length === 0) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }
        const results = await Promise.allSettled(
            list.map((id) => deleteAccount(id))
        );

        const successResults: string[] = [];
        const failResults: string[] = [];

        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                const response = result.value;
                if (response.code === 0) {
                    successResults.push(response.message);
                } else {
                    failResults.push(
                        response.message ||
                            `Tài khoản ${list[index]}: ${
                                response.error?.detail || "Lỗi không xác định"
                            }`
                    );
                }
            } else {
                failResults.push(
                    `Tài khoản ${list[index]}: ${
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

        setConfirmDeleteOpened(false);
        setIdsToDelete([]);
        setSelectedIds([]);
        // Invalidate once after all mutations complete
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
    };

    const { mutateAsync: loginAccount } = useLoginAccountMutation({
        skipInvalidate: true,
    });

    // Helper function để check login có thành công không
    const isLoginSuccessful = (data: AccountLoginResponse): boolean => {
        return data.code === 0;
    };

    // Helper function để map response data vào AccountRow format
    const mapResponseToAccountRow = (
        accountId: string,
        response: AccountLoginResponse
    ): Partial<AccountRow> => {
        const updates: Partial<AccountRow> = {};

        // Nếu login không thành công, update status thành login_failed
        if (!isLoginSuccessful(response)) {
            updates.status = "login_failed";
        } else {
            // Nếu thành công, có thể update status thành active
            // (tùy vào logic business, có thể giữ nguyên status hiện tại)
            updates.status = "active";
        }

        return updates;
    };

    // Setup batch processor
    const { process, processInfo } = useBatchProcessor<
        string,
        AccountLoginResponse
    >(
        async (accountId) => {
            return await loginAccount(accountId);
        },
        {
            batchSize: LOGIN_BATCH_SIZE,
            delayBetweenBatches: LOGIN_BATCH_DELAY,
            onBatchStart: (batch) => {
                // Set processingAccountIds cho batch hiện tại
                setProcessingAccountIds(new Set(batch));
            },
            onBatchComplete: (results: BatchResult<AccountLoginResponse>[]) => {
                // Clear processingAccountIds cho batch vừa xong
                setProcessingAccountIds(new Set());

                // Update updatedAccounts với data từ response (sử dụng functional update)
                setUpdatedAccounts((prevUpdatedAccounts) => {
                    const newUpdatedAccounts = new Map(prevUpdatedAccounts);
                    results.forEach((result) => {
                        const accountId = result.input as string;
                        if (result.success && result.data) {
                            const updates = mapResponseToAccountRow(
                                accountId,
                                result.data
                            );
                            newUpdatedAccounts.set(accountId, updates);
                        } else if (!result.success) {
                            // Nếu thất bại, update status thành login_failed
                            newUpdatedAccounts.set(accountId, {
                                status: "login_failed",
                            });
                        }
                    });
                    return newUpdatedAccounts;
                });
            },
            onComplete: (allResults: BatchResult<AccountLoginResponse>[]) => {
                // Lưu results để hiển thị trong banner
                setLoginResults(allResults);

                const successResults: string[] = [];
                const failResults: string[] = [];

                allResults.forEach((result) => {
                    if (result.success && result.data) {
                        if (result.data.code === 0) {
                            successResults.push(result.data.message);
                        } else {
                            failResults.push(
                                result.data.message ||
                                    result.data.error?.detail ||
                                    "Lỗi không xác định"
                            );
                        }
                    } else {
                        failResults.push(
                            result.error?.response?.data?.message ||
                                "Lỗi không xác định"
                        );
                    }
                });

                // Show toast tổng kết
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

                // Invalidate query một lần duy nhất sau tất cả batch
                queryClient.invalidateQueries({ queryKey: ["accounts"] });

                // Reset states (giữ lại loginResults để hiển thị banner)
                setProcessingAccountIds(new Set());
                setUpdatedAccounts(new Map());
            },
        }
    );

    const handleLoginAccount = async (ids: string | string[]) => {
        const list = Array.isArray(ids) ? ids : [ids];
        if (list.length === 0) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }

        // Sử dụng batch processor
        await process(list);
    };

    const isLoggingIn = processInfo.isProcessing;

    // Hook để ngăn chặn reload khi đang xử lý
    const { confirmReload } = usePreventReload(isLoggingIn, () => {
        setShowReloadWarningModal(true);
    });

    // Check và hiển thị thông báo sau reload nếu quá trình bị hủy
    useEffect(() => {
        try {
            const interrupted = sessionStorage.getItem(
                "loginProcessingInterrupted"
            );
            if (interrupted) {
                const data = JSON.parse(interrupted);
                // Check nếu không quá cũ (ví dụ < 1 phút)
                if (Date.now() - data.timestamp < 60 * 1000) {
                    showErrorToast(
                        "Quá trình đăng nhập đã bị hủy do reload trang"
                    );
                }
                // Clear flag
                sessionStorage.removeItem("loginProcessingInterrupted");
            }
        } catch (error) {
            console.error("Failed to check interrupted processing:", error);
        }
    }, []);

    const { mutateAsync: syncVoucher, isPending: isSyncingVoucher } =
        useSyncVoucherMutation({ skipInvalidate: true });

    const handleSyncVoucher = async (ids: string | string[]) => {
        const list = Array.isArray(ids) ? ids : [ids];
        if (list.length === 0) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }
        const results = await Promise.allSettled(
            list.map((id) => syncVoucher(id))
        );

        const successResults: string[] = [];
        const failResults: string[] = [];

        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                const response = result.value;
                if (response.code === 0) {
                    successResults.push(response.message);
                } else {
                    failResults.push(
                        response.message ||
                            `Tài khoản ${list[index]}: ${
                                response.error?.detail || "Lỗi không xác định"
                            }`
                    );
                }
            } else {
                failResults.push(
                    `Tài khoản ${list[index]}: ${
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
        queryClient.invalidateQueries({ queryKey: ["vouchers"] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center justify-between w-full">
                    <Title order={3} className="font-semibold truncate">
                        Quản lý tài khoản
                    </Title>
                    <AccountFilterBar
                        searchValue={searchValue}
                        onSearchChange={(val) => {
                            setSearchValue(val);
                            setPage(1);
                        }}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        statusOptions={statusOptions}
                        total={serverTotal || 0}
                        bannedCount={
                            rows.filter((r) => r.status !== "active").length
                        }
                        activeCount={
                            rows.filter((r) => r.status === "active").length
                        }
                        onOpenAddAccount={() => setAddAccountModalOpened(true)}
                    />
                </div>

                {/* Statistics and Action Buttons */}
                <AccountActionsBar
                    searchValue={searchValue}
                    filteredCount={serverTotal || 0}
                    selectedCount={selectedIds.length}
                    selectedIds={selectedIds}
                    onDelete={() => {
                        setIdsToDelete(selectedIds);
                        setConfirmDeleteOpened(true);
                    }}
                    onLogin={() => handleLoginAccount(selectedIds)}
                    onSyncVoucher={() => handleSyncVoucher(selectedIds)}
                    isDeleting={isDeleting}
                    isLoggingIn={isLoggingIn}
                    isSyncingVoucher={isSyncingVoucher}
                    processInfo={
                        isLoggingIn
                            ? {
                                  processedCount: processInfo.processedCount,
                                  totalCount: processInfo.totalCount,
                                  currentBatch: processInfo.currentBatch,
                                  totalBatches: processInfo.totalBatches,
                                  progress: processInfo.progress,
                              }
                            : undefined
                    }
                    loginResults={
                        loginResults.length > 0 ? loginResults : undefined
                    }
                    accountMap={
                        rows.length > 0
                            ? new Map(
                                  rows.map((row) => [
                                      row.id,
                                      {
                                          name: row.name,
                                          email: row.email,
                                          phone: row.phone,
                                      },
                                  ])
                              )
                            : undefined
                    }
                    onCloseBanner={() => setLoginResults([])}
                />
            </div>

            {/* Table */}
            <DataTable<Row>
                data={rows}
                columns={columns}
                getRowId={(r) => r.id}
                pagination={apiPagination}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                loading={isLoading}
                emptyMessage="Chưa có tài khoản nào."
                selectable
                selection={selectedIds}
                onSelectionChange={(ids) => {
                    // Disable selection khi đang xử lý
                    if (!isLoggingIn) {
                        setSelectedIds(ids);
                    }
                }}
                showSelectAll
            />

            {/* Add Account Modal */}
            <AddAccountModal
                opened={addAccountModalOpened}
                onClose={() => setAddAccountModalOpened(false)}
                onSubmit={(result) => {
                    if (result.allSuccess) {
                        setAddAccountModalOpened(false);
                    }
                }}
            />

            <ConfirmDeleteModal
                opened={confirmDeleteOpened}
                count={idsToDelete.length}
                onClose={() => setConfirmDeleteOpened(false)}
                onConfirm={() => handleDelete(idsToDelete)}
                isPending={isDeleting}
            />

            <UpdateAccountModal
                opened={updateModalOpened}
                accountId={editingAccount?.id || null}
                email={editingAccount?.email || null}
                phone={editingAccount?.phone || null}
                onClose={() => setUpdateModalOpened(false)}
            />

            {/* Modal cảnh báo reload */}
            <ProcessingInterruptedModal
                opened={showReloadWarningModal}
                onClose={() => setShowReloadWarningModal(false)}
                onConfirm={confirmReload}
            />
        </div>
    );
};

export default AccountManagementPage;
