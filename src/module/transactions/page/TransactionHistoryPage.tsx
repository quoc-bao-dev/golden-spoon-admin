import {
    ColumnDef,
    DataTable,
    formatCurrencyVND,
    Icon,
    mapStatusBadgeStyle,
    mapTypeBadgeStyle,
    PaginationState,
    splitDateTimeLabel,
} from "@/core/components/ui";
import { Badge, Select, TextInput, Title } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { useSessionStorage } from "@mantine/hooks";
import { useState } from "react";

const TransactionHistoryPage = () => {
    // For DateInput state
    const [value, setValue] = useState<DatesRangeValue<string>>([null, null]);
    type TransactionRow = {
        date: string;
        type: string;
        amount: number;
        balance: number;
        status: string;
        code: string;
    };
    const transactions: TransactionRow[] = [
        {
            date: "06/09/2025 04:20 PM",
            type: "Mua hàng",
            amount: 699000,
            balance: 699000,
            status: "Hoàn thành",
            code: "JQKA26988",
        },
        ...Array(100).fill({
            date: "06/09/2025 04:20 PM",
            type: "Nạp tiền",
            amount: 699000,
            balance: 699000,
            status: "Hoàn tiền",
            code: "JQKA26988",
        }),
    ];
    const [page, setPage] = useSessionStorage<number>({
        key: "transaction-history.page",
        defaultValue: 1,
    });
    const [pageSize, setPageSize] = useSessionStorage<number>({
        key: "transaction-history.pageSize",
        defaultValue: 10,
    });
    const total = transactions.length;
    const start = (page - 1) * pageSize;
    const pageItems = transactions.slice(start, start + pageSize);

    type Row = TransactionRow;
    const columns: ColumnDef<Row>[] = [
        {
            key: "date",
            header: "Ngày giao dịch",
            className: "min-w-[120px]",
            render: ({ row }) => {
                const { date, time } = splitDateTimeLabel(row.date);
                return (
                    <div className="whitespace-nowrap">
                        <div className="font-medium">{date}</div>
                        <div className="text-xs text-gray-400">{time}</div>
                    </div>
                );
            },
        },
        {
            key: "type",
            header: "Loại giao dịch",
            className: "min-w-[110px]",
            render: ({ row }) => {
                const style = mapTypeBadgeStyle(row.type);
                return (
                    <Badge
                        style={style}
                        variant="light"
                        radius="md"
                        size="md"
                        className=" p-3.5! rounded-2xl!"
                    >
                        {row.type}
                    </Badge>
                );
            },
        },
        {
            key: "amount",
            header: "Số tiền",
            className: "min-w-[110px] whitespace-nowrap",
            accessor: (r) => formatCurrencyVND(r.amount),
        },
        {
            key: "balance",
            header: "Số dư sau",
            className: "min-w-[110px] whitespace-nowrap",
            accessor: (r) => formatCurrencyVND(r.balance),
        },
        {
            key: "status",
            header: "Trạng thái giao dịch",
            className: "min-w-[130px]",
            render: ({ row }) => {
                const style = mapStatusBadgeStyle(row.status);
                return (
                    <Badge
                        style={style}
                        variant="light"
                        radius="md"
                        size="md"
                        className="font-normal p-3.5! rounded-2xl!"
                    >
                        {row.status}
                    </Badge>
                );
            },
        },
        {
            key: "code",
            header: "Nội dung giao dịch",
            className: "min-w-[100px] whitespace-nowrap",
            accessor: (r) => r.code,
        },
    ];

    const pagination: PaginationState = { page, pageSize, total };
    return (
        <div className=" flex flex-col flex-1 min-h-0 h-full">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center justify-between w-full">
                    <Title order={3} className="font-semibold truncate">
                        Lịch sử giao dịch
                    </Title>
                    <div className="flex gap-2 flex-1 ml-8 flex-wrap justify-end">
                        <div className="relative flex-1 max-w-xs">
                            <TextInput
                                placeholder="Tìm kiếm"
                                className="w-full"
                                leftSection={
                                    <Icon icon="icon-search" size={18} />
                                }
                            />
                        </div>
                        <Select
                            placeholder="Trạng thái giao dịch: Tất cả"
                            data={["Tất cả", "Hoàn thành", "Hoàn tiền"]}
                            className="min-w-[200px]"
                        />
                        <Select
                            placeholder="Loại giao dịch: Tất cả"
                            data={["Tất cả", "Mua hàng", "Nạp tiền"]}
                            className="min-w-[200px]"
                        />
                        <DatePickerInput
                            type="range"
                            rightSection={
                                <Icon icon="icon-calendar" size={18} />
                            }
                            placeholder="Pick dates range"
                            value={value}
                            onChange={setValue}
                        />
                    </div>
                </div>
            </div>
            {/* table */}
            <DataTable<Row>
                data={pageItems}
                columns={columns}
                getRowId={(r, i) => `${r.code}-${i}`}
                pagination={pagination}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                emptyMessage="Chưa có lịch sử giao dịch nào."
            />
        </div>
    );
};

export default TransactionHistoryPage;
