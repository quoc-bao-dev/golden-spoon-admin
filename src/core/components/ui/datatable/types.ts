import React from "react";

export type PaginationState = {
    page: number;
    pageSize: number;
    total: number;
};

export type ColumnDef<T> = {
    key: string;
    header: React.ReactNode;
    width?: number | string;
    align?: "left" | "center" | "right";
    accessor?: (row: T) => React.ReactNode;
    render?: (ctx: { row: T; rowIndex: number }) => React.ReactNode;
    className?: string;
};

export type GetRowId<T> = (row: T, index: number) => string;

export type RowEventHandlers<T> = {
    onRowClick?: (row: T, index: number) => void;
};

export type SelectionState = {
    selectedIds: string[];
};

export type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    getRowId?: GetRowId<T>;
    pagination: PaginationState;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;

    loading?: boolean;
    emptyMessage?: string;
    rowEvents?: RowEventHandlers<T>;

    className?: string;
    tableHeight?: number | string;

    selectable?: boolean;
    selection?: SelectionState["selectedIds"];
    defaultSelection?: string[];
    onSelectionChange?: (ids: string[]) => void;
    showSelectAll?: boolean;
};


