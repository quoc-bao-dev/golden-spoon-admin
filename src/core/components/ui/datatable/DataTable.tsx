"use client";

import {
    Checkbox,
    Pagination,
    ScrollArea,
    Select,
    Skeleton,
    Table,
} from "@mantine/core";
import { useMemo, useState, useEffect } from "react";
import { Nodata } from "../Nodata";
import { DataTableProps, GetRowId } from "./types";

function useControlledSelection(
    controlled: string[] | undefined,
    defaultValue: string[] | undefined,
    onChange?: (ids: string[]) => void
) {
    const [uncontrolled, setUncontrolled] = useState<string[]>(
        defaultValue || []
    );
    const selected = controlled !== undefined ? controlled : uncontrolled;
    const setSelected = (ids: string[]) => {
        if (controlled === undefined) setUncontrolled(ids);
        onChange?.(ids);
    };
    return { selected, setSelected } as const;
}

export function DataTable<T>(props: DataTableProps<T>) {
    const {
        data,
        columns,
        getRowId,
        pagination,
        onPageChange,
        onPageSizeChange,
        loading,
        emptyMessage,
        rowEvents,
        className,
        tableHeight,
        selectable,
        selection,
        defaultSelection,
        onSelectionChange,
        showSelectAll,
    } = props;

    const rowIdGetter: GetRowId<T> = useMemo(
        () => getRowId || ((_, index) => String(index)),
        [getRowId]
    );

    const { selected, setSelected } = useControlledSelection(
        selection,
        defaultSelection,
        onSelectionChange
    );

    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [isCtrlOrCmdPressed, setIsCtrlOrCmdPressed] = useState(false);

    // Track Shift, Ctrl, and Cmd key state for cursor pointer
    useEffect(() => {
        if (!selectable) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setIsShiftPressed(true);
            }
            if (e.ctrlKey || e.metaKey) {
                setIsCtrlOrCmdPressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setIsShiftPressed(false);
            }
            // Check if Ctrl or Cmd is still pressed
            if (!e.ctrlKey && !e.metaKey) {
                setIsCtrlOrCmdPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [selectable]);

    const allIdsOnPage = useMemo(
        () => data.map((r, i) => rowIdGetter(r, i)),
        [data, rowIdGetter]
    );
    const allSelectedOnPage = useMemo(
        () =>
            allIdsOnPage.length > 0 &&
            allIdsOnPage.every((id) => selected.includes(id)),
        [allIdsOnPage, selected]
    );

    const toggleRow = (id: string) => {
        if (!selectable) return;
        if (selected.includes(id)) {
            setSelected(selected.filter((x) => x !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const toggleAll = () => {
        if (!selectable) return;
        if (allSelectedOnPage)
            setSelected(selected.filter((id) => !allIdsOnPage.includes(id)));
        else setSelected(Array.from(new Set([...selected, ...allIdsOnPage])));
    };

    const startIndex = (pagination.page - 1) * pagination.pageSize;

    return (
        <div
            className={`flex-1 pt-3 bg-white rounded-xl flex flex-col min-h-0 ${
                className || ""
            }`}
            style={{ height: tableHeight }}
        >
            {data.length === 0 && !loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Nodata message={emptyMessage} />
                </div>
            ) : (
                <ScrollArea className="flex-1" scrollbarSize={8} type="auto">
                    <Table
                        stickyHeader
                        highlightOnHover
                        withRowBorders={false}
                        className="w-full table-fixed"
                        style={{
                            borderCollapse: "separate",
                        }}
                    >
                        <Table.Thead c={"gray.4"}>
                            <Table.Tr>
                                <Table.Th
                                    className="text-xs font-medium w-8 bg-[#F1F3F5]! text-center align-middle"
                                    py={"lg"}
                                >
                                    No.
                                </Table.Th>
                                {selectable && (
                                    <Table.Th
                                        className="text-xs font-medium w-10 bg-[#F1F3F5]! align-middle"
                                        py={"lg"}
                                    >
                                        {showSelectAll && (
                                            <Checkbox
                                                color="brand"
                                                checked={allSelectedOnPage}
                                                onChange={() => toggleAll()}
                                            />
                                        )}
                                    </Table.Th>
                                )}
                                {columns.map((col) => (
                                    <Table.Th
                                        key={col.key}
                                        className={`text-xs font-medium bg-[#F1F3F5]! align-middle px-5! ${
                                            col.align === "right"
                                                ? "text-right"
                                                : col.align === "center"
                                                ? "text-center"
                                                : "text-left"
                                        } ${col.className || ""}`}
                                    >
                                        {col.header}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading
                                ? Array.from({
                                      length: pagination.pageSize || 10,
                                  }).map((_, rowIndex) => (
                                      <Table.Tr
                                          key={`skeleton-${rowIndex}`}
                                          className="border-b! border-dashed border-gray-200!"
                                      >
                                          <Table.Td className="text-sm text-gray-900 align-middle text-center">
                                              <Skeleton
                                                  height={12}
                                                  width={24}
                                                  mx="auto"
                                                  radius="xl"
                                              />
                                          </Table.Td>
                                          {selectable && (
                                              <Table.Td className="align-middle">
                                                  <Skeleton
                                                      height={18}
                                                      width={18}
                                                      radius="xl"
                                                  />
                                              </Table.Td>
                                          )}
                                          {columns.map((col, colIndex) => (
                                              <Table.Td
                                                  key={`skeleton-${rowIndex}-${col.key}-${colIndex}`}
                                                  className={`text-sm align-middle px-5! ${
                                                      col.align === "right"
                                                          ? "text-right"
                                                          : col.align ===
                                                            "center"
                                                          ? "text-center"
                                                          : "text-left"
                                                  }`}
                                              >
                                                  <Skeleton
                                                      height={14}
                                                      width="60%"
                                                      radius="sm"
                                                  />
                                              </Table.Td>
                                          ))}
                                      </Table.Tr>
                                  ))
                                : data.map((row, rowIndex) => {
                                      const id = rowIdGetter(row, rowIndex);
                                      const shouldShowPointer =
                                          selectable &&
                                          (isShiftPressed ||
                                              isCtrlOrCmdPressed ||
                                              rowEvents?.onRowClick);
                                      return (
                                          <Table.Tr
                                              key={id}
                                              className="border-b! border-dashed border-gray-200!  "
                                              onClick={(e) => {
                                                  if (
                                                      selectable &&
                                                      (e.shiftKey ||
                                                          e.ctrlKey ||
                                                          e.metaKey)
                                                  ) {
                                                      toggleRow(id);
                                                  } else {
                                                      rowEvents?.onRowClick?.(
                                                          row,
                                                          rowIndex
                                                      );
                                                  }
                                              }}
                                              style={{
                                                  cursor: shouldShowPointer
                                                      ? "pointer"
                                                      : undefined,
                                              }}
                                          >
                                              <Table.Td className="text-sm text-gray-900 align-middle text-center">
                                                  {startIndex + rowIndex + 1}
                                              </Table.Td>
                                              {selectable && (
                                                  <Table.Td
                                                      className="align-middle"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          // Allow Shift/Ctrl/Cmd + Click on checkbox cell
                                                          if (
                                                              e.shiftKey ||
                                                              e.ctrlKey ||
                                                              e.metaKey
                                                          ) {
                                                              toggleRow(id);
                                                          }
                                                      }}
                                                  >
                                                      <Checkbox
                                                          color="brand"
                                                          checked={selected.includes(
                                                              id
                                                          )}
                                                          onChange={() =>
                                                              toggleRow(id)
                                                          }
                                                      />
                                                  </Table.Td>
                                              )}
                                              {columns.map((col) => (
                                                  <Table.Td
                                                      key={`${id}-${col.key}`}
                                                      className={`text-sm align-middle px-5! ${
                                                          col.align === "right"
                                                              ? "text-right"
                                                              : col.align ===
                                                                "center"
                                                              ? "text-center"
                                                              : "text-left"
                                                      }`}
                                                  >
                                                      {col.render
                                                          ? col.render({
                                                                row,
                                                                rowIndex,
                                                            })
                                                          : col.accessor
                                                          ? col.accessor(row)
                                                          : null}
                                                  </Table.Td>
                                              ))}
                                          </Table.Tr>
                                      );
                                  })}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            )}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 mt-auto bg-white">
                <Pagination
                    color="brand"
                    value={pagination.page}
                    onChange={(p) => onPageChange?.(p)}
                    total={Math.max(
                        1,
                        Math.ceil(pagination.total / pagination.pageSize)
                    )}
                    radius="md"
                    size="sm"
                />
                <div className="flex items-center gap-2 text-gray-600">
                    <span>Hiển thị số hàng:</span>
                    <Select
                        value={String(pagination.pageSize)}
                        onChange={(val) => {
                            const size = Number(val || pagination.pageSize);
                            onPageSizeChange?.(size);
                            onPageChange?.(1);
                        }}
                        data={["5", "10", "50", "100", "500"]}
                        className="w-[72px]"
                        comboboxProps={{ withinPortal: false }}
                    />
                    <span>trên {pagination.total} kết quả</span>
                </div>
            </div>
        </div>
    );
}

export default DataTable;
