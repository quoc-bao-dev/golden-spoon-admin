import { Button, Select, TextInput } from "@mantine/core";
import { Icon, Stats } from "@/core/components/ui";

type AccountFilterBarProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    statusFilter: string | null;
    onStatusChange: (value: string | null) => void;
    statusOptions: { key: string; value: string }[];
    total: number;
    bannedCount: number;
    activeCount: number;
    onOpenAddAccount: () => void;
};

export const AccountFilterBar = ({
    searchValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    statusOptions,
    total,
    bannedCount,
    activeCount,
    onOpenAddAccount,
}: AccountFilterBarProps) => {
    return (
        <div className="flex gap-2 flex-1 ml-8 flex-wrap justify-end items-center">
            <div className="relative flex-1 max-w-xs">
                <TextInput
                    placeholder="Tìm kiếm"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.currentTarget.value)}
                    className="w-full"
                    leftSection={<Icon icon="icon-search" size={18} />}
                />
            </div>

            <Stats
                items={[
                    { label: "Tổng", value: total, color: "#000" },
                    { label: "Banned", value: bannedCount, color: "#FA5252" },
                    { label: "Active", value: activeCount, color: "#12B886" },
                ]}
            />

            <Select
                placeholder="Trạng thái: Tất cả"
                value={statusFilter}
                onChange={onStatusChange}
                data={statusOptions.map((o) => ({
                    value: o.key,
                    label: o.value,
                }))}
                className="min-w-[200px]"
            />
            <Button
                leftSection="+"
                color="brand"
                size="sm"
                onClick={onOpenAddAccount}
            >
                Thêm tài khoản
            </Button>
        </div>
    );
};

export default AccountFilterBar;
