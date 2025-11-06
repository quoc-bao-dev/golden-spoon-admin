import {
    ColumnDef,
    DataTable,
    Icon,
    PaginationState,
    showErrorToast,
    showSuccessToast,
} from "@/core/components/ui";
import type { AccountAuthStatus } from "@/service/accounts";
import {
    useAccountsQuery,
    useDeleteAccountMutation,
    useLoginAccountMutation,
} from "@/service/accounts";
import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Menu,
    Title,
    Tooltip,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { AddAccountModal } from "../components";
import AccountActionsBar from "../components/AccountActionsBar";
import AccountFilterBar from "../components/AccountFilterBar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import UpdateAccountModal from "../components/UpdateAccountModal";
import { _Image } from "@/core/const/asset/image";

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
                    style: { background: "#E6FCF5", color: "#36B37E" },
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
                const { style, label } = getStatusBadgeStyle(row.status);
                return (
                    <Badge
                        style={style}
                        variant="light"
                        radius="md"
                        size="md"
                        className="font-normal p-3.5! rounded-2xl!"
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
                            <ActionIcon variant="subtle" size="lg">
                                ⋮
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
                                disabled={isDeleting}
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
        page_size: pageSize,
        search: searchValue || undefined,
        status: statusFilter ? (statusFilter as AccountAuthStatus) : undefined,
    });

    const rows: AccountRow[] = useMemo(() => {
        if (!accountsData) return [];
        const items = accountsData?.accounts ?? [];
        return items.map((item) => ({
            id: String(item.id ?? ""),
            name: String(item.full_name ?? item.full_name ?? item.email ?? ""),
            email: String(item.email ?? ""),
            emailVerified: Boolean(item.email_verified ?? false),
            phone: String(item.phone_number ?? ""),
            password: item.password ?? "-",
            rewardPoints: Number(item.coin_amount ?? 0),
            status: item.auth_status,
            avatarUrl: String(
                (item as any).avatar_url || (item as any).avatar || ""
            ),
        }));
    }, [accountsData]);

    const serverTotal = accountsData?.total;
    const apiPagination: PaginationState = {
        page,
        pageSize,
        total: serverTotal!,
    };

    const { mutateAsync: deleteAccount, isPending: isDeleting } =
        useDeleteAccountMutation({
            onSuccess: () => {
                // showSuccessToast("Xóa tài khoản thành công");
            },
            onError: () => {
                // showErrorToast("Xóa tài khoản thất bại");
            },
        });

    const handleDelete = async (ids?: string[]) => {
        const list = ids ?? selectedIds;
        if (list.length === 0) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }
        const results = await Promise.all(list.map((id) => deleteAccount(id)));
        const success = results.length;
        const fail = results.length - success;

        if (success > 0)
            showSuccessToast(`Xóa thành công ${success} tài khoản`);
        if (fail > 0) showErrorToast(`Xóa thất bại ${fail} tài khoản`);
        setConfirmDeleteOpened(false);
        setIdsToDelete([]);
        setSelectedIds([]);
    };

    const { mutateAsync: loginAccount, isPending: isLoggingIn } =
        useLoginAccountMutation({});

    const handleLoginAccount = async (ids: string | string[]) => {
        const list = Array.isArray(ids) ? ids : [ids];
        if (list.length === 0) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }
        const results = await Promise.all(list.map((id) => loginAccount(id)));
        const success = results.filter((r) => Boolean(r)).length;
        const fail = results.length - success;
        if (success > 0)
            showSuccessToast(`Đăng nhập thành công ${success} tài khoản`);
        if (fail > 0) showErrorToast(`Đăng nhập thất bại ${fail} tài khoản`);
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
                    isDeleting={isDeleting}
                    isLoggingIn={isLoggingIn}
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
                defaultSelection={selectedIds}
                onSelectionChange={setSelectedIds}
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
        </div>
    );
};

export default AccountManagementPage;
