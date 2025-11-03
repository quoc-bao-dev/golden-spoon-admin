import {
    ColumnDef,
    DataTable,
    Icon,
    PaginationState,
    Stats,
} from "@/core/components/ui";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Menu,
    Select,
    TextInput,
    Title,
    Tooltip,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { AddAccountModal } from "../components";
import { useAccountsQuery } from "@/service/accounts";
import { useDeleteAccountMutation } from "@/service/accounts";
import { useLoginAccountMutation } from "@/service/accounts";
import { showSuccessToast, showErrorToast } from "@/core/components/ui";
import type { AccountAuthStatus } from "@/service/accounts";

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
};

const AccountManagementPage = () => {
    const [searchValue, setSearchValue] = useState("0969-886-969");
    const [statusFilter, setStatusFilter] = useState<string | null>("Tất cả");
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

    // Mock data
    const accounts: AccountRow[] = [
        {
            id: "1",
            name: "Giàng A Sướng",
            email: "peachytran420@gmail.com",
            emailVerified: true,
            phone: "0969-886-969",
            password: "password123",
            rewardPoints: 69420,
            status: "active",
            tokenExpired: true,
        },
        {
            id: "2",
            name: "Y Thuyên Mô",
            email: "peachytran420@gmail.com",
            emailVerified: false,
            phone: "0969-886-969",
            password: "123789POIEWQ!@#$%",
            rewardPoints: 69420,
            status: "locked",
        },
        ...Array(67)
            .fill(null)
            .map((_, i) => ({
                id: String(i + 3),
                name: "Giàng A Sướng",
                email: "peachytran420@gmail.com",
                emailVerified: true,
                phone: "0969-886-969",
                password: "password123",
                rewardPoints: 69420,
                status: "active" as const,
            })),
    ];

    // Filter accounts
    const filteredAccounts = accounts.filter((account) => {
        const matchesSearch =
            !searchValue ||
            account.phone.includes(searchValue) ||
            account.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            account.email.toLowerCase().includes(searchValue.toLowerCase());

        const matchesStatus =
            statusFilter === "Tất cả" ||
            (statusFilter === "Active" && account.status === "active") ||
            (statusFilter === "Banned" && account.status !== "active");

        return matchesSearch && matchesStatus;
    });

    const total = filteredAccounts.length;
    const bannedCount = filteredAccounts.filter(
        (a) => a.status !== "active"
    ).length;
    const activeCount = filteredAccounts.filter(
        (a) => a.status === "active"
    ).length;

    const start = (page - 1) * pageSize;
    const pageItems = filteredAccounts.slice(start, start + pageSize);

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
            className: "min-w-[200px]",
            render: ({ row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        <div className="font-medium">{row.name || "-"}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            {row.email || "-"}
                            {row.emailVerified && (
                                <Tooltip label="E-mail đã xác thực">
                                    <Box
                                        component="span"
                                        className="inline-flex items-center cursor-pointer"
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
                                    className="inline-flex items-center cursor-pointer"
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
                            >
                                Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item
                                leftSection={
                                    <Icon icon="icon-trash" size={16} />
                                }
                                color="red"
                                onClick={() => deleteAccount(row.id)}
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
        pageSize,
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
        }));
    }, [accountsData]);

    const serverTotal = accountsData?.total ?? total;
    const apiPagination: PaginationState = {
        page,
        pageSize,
        total: serverTotal,
    };

    const { mutate: deleteAccount, isPending: isDeleting } =
        useDeleteAccountMutation({
            onSuccess: () => {
                showSuccessToast("Xóa tài khoản thành công");
            },
            onError: () => {
                showErrorToast("Xóa tài khoản thất bại");
            },
        });

    const handleDelete = () => {
        if (selectedIds.length === 0) return;
        selectedIds.forEach((id) => deleteAccount(id));
        setSelectedIds([]);
    };

    const { mutate: loginAccount, isPending: isLoggingIn } =
        useLoginAccountMutation({
            onSuccess: () => {
                showSuccessToast("Đăng nhập thành công");
            },
            onError: () => {
                showErrorToast("Đăng nhập thất bại");
            },
        });

    const handleLoginAccount = (ids: string | string[]) => {
        const list = Array.isArray(ids) ? ids : [ids];
        if (list.length === 0) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }
        list.forEach((id) => loginAccount(id));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center justify-between w-full">
                    <Title order={3} className="font-semibold truncate">
                        Quản lý tài khoản
                    </Title>
                    <div className="flex gap-2 flex-1 ml-8 flex-wrap justify-end items-center">
                        <div className="relative flex-1 max-w-xs">
                            <TextInput
                                placeholder="Tìm kiếm"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.currentTarget.value);
                                    setPage(1);
                                }}
                                className="w-full"
                                leftSection={
                                    <Icon icon="icon-search" size={18} />
                                }
                            />
                        </div>

                        <Stats
                            items={[
                                {
                                    label: "Tổng",
                                    value: total,
                                    color: "#000",
                                },
                                {
                                    label: "Banned",
                                    value: bannedCount,
                                    color: "#FA5252",
                                },
                                {
                                    label: "Active",
                                    value: activeCount,
                                    color: "#12B886",
                                },
                            ]}
                        />

                        <Select
                            placeholder="Trạng thái: Tất cả"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            data={["Tất cả", "Active", "Banned"]}
                            className="min-w-[200px]"
                        />
                        <Button
                            leftSection="+"
                            color="brand"
                            size="sm"
                            onClick={() => setAddAccountModalOpened(true)}
                        >
                            Thêm tài khoản
                        </Button>
                    </div>
                </div>

                {/* Statistics and Action Buttons */}
                <div className="flex items-center justify-between gap-4 min-h-[48px]">
                    <div className="flex gap-4">
                        {/* Search Results Info */}
                        {searchValue && (
                            <div className="mb-2 text-sm text-gray-400">
                                Tìm thấy{" "}
                                <span className="text-gray-700">
                                    {filteredAccounts.length}
                                </span>{" "}
                                kết quả cho "
                                <span className="text-gray-700">
                                    {searchValue}
                                </span>
                                "
                            </div>
                        )}

                        {/* Selection Info */}
                        {selectedIds.length > 0 && (
                            <div className="mb-2 text-sm text-[#E67700]">
                                Đã chọn: {selectedIds.length}
                            </div>
                        )}
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                leftSection={
                                    <Icon icon="icon-pencil" size={16} />
                                }
                            >
                                Cập nhật thông tin tài khoản
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                leftSection={
                                    <Icon icon="icon-user-search" size={16} />
                                }
                            >
                                Kiểm tra tài khoản
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                leftSection={
                                    <Icon icon="icon-trash" size={16} />
                                }
                                onClick={handleDelete}
                                loading={isDeleting}
                            >
                                Xóa tài khoản
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                leftSection={
                                    <Icon icon="icon-login" size={16} />
                                }
                                onClick={() => handleLoginAccount(selectedIds)}
                                loading={isLoggingIn}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    )}
                </div>
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
        </div>
    );
};

export default AccountManagementPage;
