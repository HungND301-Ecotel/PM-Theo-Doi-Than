"use client";

import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    getExpandedRowModel,
    type ColumnDef,
    type SortingState,
    type VisibilityState,
    type RowSelectionState,
    type PaginationState,
    type ColumnSizingState,
    type ExpandedState,
} from "@tanstack/react-table";
import { ChevronRight, ChevronDown, FolderOpen, FolderClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TableToolbar from "../core/TableToolbar";
import TablePagination from "../core/TablePagination";
import TableLoading from "../core/TableLoading";
import TableEmpty from "../core/TableEmpty";
import TableFilter, {
    type FilterField,
    type FilterValue,
} from "../core/TableFilter";

type PaginationMode =
    | {
        manualPagination: true;
        pageCount: number;
        totalCount?: number;
        page?: number;
        rowsPerPage?: number;
        onPageChange?: (page: number) => void;
        onRowsPerPageChange?: (rowsPerPage: number) => void;
    }
    | {
        manualPagination?: false;
        pageCount?: never;
        totalCount?: never;
        page?: never;
        rowsPerPage?: never;
        onPageChange?: never;
        onRowsPerPageChange?: never;
    };

type SortingMode =
    | {
        manualSorting: true;
        sorting: SortingState;
        onSortingChange: (sorting: SortingState) => void;
    }
    | {
        manualSorting?: false;
        sorting?: never;
        onSortingChange?: never;
    };

interface BaseTreeTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    getSubRows?: (row: TData) => TData[] | undefined;

    // Custom Tree Props
    treeColumnId?: string;
    indentSize?: number;
    defaultExpanded?: boolean | Record<string, boolean>;
    showExpandCollapseAll?: boolean;

    // Toolbar
    title?: string;
    searchValue?: string;
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
    onAdd?: () => void;
    onImportExcel?: (file: File) => void;
    importExcelAccept?: string;
    isImporting?: boolean;
    showExport?: boolean;
    onExportCsv?: (selectedRows: TData[]) => void;
    onExportPdf?: () => void;
    onPrint?: () => void;

    // Filter panel
    filterFields?: FilterField[];
    filterValues?: FilterValue;
    onFilterChange?: (values: FilterValue) => void;

    // UI options
    loading?: boolean;
    bordered?: boolean;
    striped?: boolean;
    dense?: boolean;
    hoverable?: boolean;
    stickyHeader?: boolean;
    maxHeight?: number | string;
    showToolbar?: boolean;
    showColumnToggle?: boolean;
    showPagination?: boolean;
    emptyComponent?: React.ReactNode;
    customActions?: React.ReactNode;

    // Save Inline
    onSaveRow?: (updatedRow: TData) => void;

    defaultPageSize?: number;
}

export type TreeTableProps<TData> = BaseTreeTableProps<TData> &
    PaginationMode &
    SortingMode;

export function TreeTable<TData>({
    columns,
    data,
    getSubRows,

    treeColumnId,
    indentSize = 20,
    defaultExpanded = false,
    showExpandCollapseAll = true,

    manualPagination = false,
    manualSorting = false,
    pageCount,
    totalCount,

    page: controlledPage,
    rowsPerPage: controlledRowsPerPage,
    onPageChange,
    onRowsPerPageChange,

    sorting: controlledSorting,
    onSortingChange: onControlledSortingChange,

    defaultPageSize = 10,

    title,
    searchValue = "",
    onSearch,
    onRefresh,
    onAdd,
    onImportExcel,
    importExcelAccept,
    isImporting = false,
    showExport,
    onExportCsv,
    onExportPdf,
    onPrint,

    filterFields,
    filterValues = {},
    onFilterChange,

    loading = false,
    bordered = false,
    striped = true,
    dense = false,
    hoverable = true,
    stickyHeader = false,
    maxHeight,
    showToolbar = true,
    showColumnToggle = false,
    showPagination = false,
    emptyComponent,
    customActions,
    onSaveRow,
}: TreeTableProps<TData>) {
    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
    const [expanded, setExpanded] = useState<ExpandedState>(
        defaultExpanded === true ? true : (defaultExpanded || {}),
    );
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [internalPagination, setInternalPagination] = useState<PaginationState>(
        {
            pageIndex: 0,
            pageSize: defaultPageSize,
        },
    );

    // ─── Inline editing state ────────
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [editingRowDraft, setEditingRowDraft] = useState<Record<string, unknown>>({});

    // ─── Column Decorator ────────
    const finalColumns = useMemo(() => {
        return columns.map((col, idx) => {
            const isTreeCol = treeColumnId
                ? col.id === treeColumnId || (col as any).accessorKey === treeColumnId
                : idx === 0;

            if (!isTreeCol) return col;

            return {
                ...col,
                cell: (info: any) => {
                    const { row } = info;
                    const canExpand = row.getCanExpand();
                    const isExpanded = row.getIsExpanded();
                    const depth = row.depth;

                    return (
                        <div
                            className="flex items-center gap-1.5 text-left py-0.5"
                            style={{ paddingLeft: `${depth * indentSize}px` }}
                        >
                            {canExpand ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        row.getToggleExpandedHandler()();
                                    }}
                                    className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0 w-6 h-6"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </button>
                            ) : (
                                <div className="w-6 h-6 shrink-0" />
                            )}
                            <div className="flex items-center gap-2 min-w-0 truncate">
                                {col.cell
                                    ? flexRender(col.cell, info)
                                    : String(info.getValue() ?? "")}
                            </div>
                        </div>
                    );
                },
            };
        });
    }, [columns, treeColumnId, indentSize]);

    const sorting = controlledSorting ?? internalSorting;

    const pagination: PaginationState =
        controlledPage !== undefined
            ? {
                pageIndex: controlledPage,
                pageSize: controlledRowsPerPage ?? defaultPageSize,
            }
            : internalPagination;

    const table = useReactTable({
        data,
        columns: finalColumns,
        defaultColumn: { minSize: 60 },
        getSubRows,

        // Pagination
        manualPagination,
        pageCount: manualPagination ? (pageCount ?? -1) : undefined,
        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function" ? updater(pagination) : updater;
            if (controlledPage !== undefined) {
                if (next.pageIndex !== pagination.pageIndex)
                    onPageChange?.(next.pageIndex);
                if (next.pageSize !== pagination.pageSize)
                    onRowsPerPageChange?.(next.pageSize);
            } else {
                setInternalPagination(next);
            }
        },

        // Sorting
        manualSorting,
        onSortingChange: (updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater;
            if (onControlledSortingChange) onControlledSortingChange(next);
            else setInternalSorting(next);
        },

        // Visibility & Selection
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,

        // Expanded
        onExpandedChange: setExpanded,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        enableColumnResizing: true,
        columnResizeMode: "onChange",
        onColumnSizingChange: setColumnSizing,

        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            columnSizing,
            expanded,
        },

        // Meta for inline editing
        meta: {
            editingRowId,
            editingRowDraft,
            setEditingRowId: (id: string | null) => {
                if (id !== null) {
                    // Flatten tree data to find the row (simple lookup logic)
                    const findRowInTree = (items: TData[]): TData | undefined => {
                        for (const item of items) {
                            const itemId = String((item as any).id);
                            if (itemId === id) return item;
                            const subRows = getSubRows?.(item);
                            if (subRows) {
                                const found = findRowInTree(subRows);
                                if (found) return found;
                            }
                        }
                        return undefined;
                    };
                    const row = findRowInTree(data);
                    if (row) {
                        setEditingRowDraft({ ...(row as Record<string, unknown>) });
                    }
                } else {
                    setEditingRowDraft({});
                }
                setEditingRowId(id);
            },
            updateCellDraft: (columnId: string, value: unknown) => {
                setEditingRowDraft((prev) => ({ ...prev, [columnId]: value }));
            },
            revertRow: () => {
                setEditingRowDraft({});
                setEditingRowId(null);
            },
            saveRow: () => {
                if (onSaveRow && editingRowId !== null) {
                    onSaveRow(editingRowDraft as TData);
                }
                setEditingRowDraft({});
                setEditingRowId(null);
            },
        },
    });

    const hasActiveFilters = Object.values(filterValues).some((v) => v !== "");
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;

    const showEmptyState = !loading && data.length === 0;
    const showTable = !loading && data.length > 0;

    // Render expand/collapse actions
    const mergedCustomActions = useMemo(() => {
        if (!showExpandCollapseAll) return customActions;
        return (
            <div className="flex items-center gap-1 shrink-0">
                {customActions}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 gap-1.5 text-xs font-medium cursor-pointer"
                    onClick={() => table.toggleAllRowsExpanded(true)}
                    title="Mở rộng tất cả"
                >
                    <FolderOpen className="w-4 h-4 text-primary" />
                    <span className="hidden md:inline-block">Mở rộng tất cả</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 gap-1.5 text-xs font-medium cursor-pointer"
                    onClick={() => table.toggleAllRowsExpanded(false)}
                    title="Thu gọn tất cả"
                >
                    <FolderClosed className="w-4 h-4 text-muted-foreground" />
                    <span className="hidden md:inline-block">Thu gọn tất cả</span>
                </Button>
            </div>
        );
    }, [showExpandCollapseAll, customActions, table]);

    return (
        <motion.div
            layout
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
                "bg-card shadow-sm border flex flex-col",
                bordered ? "border-border" : "border-transparent",
                isFullscreen
                    ? "fixed inset-0 z-50 m-0 rounded-none w-screen h-screen overflow-hidden"
                    : "rounded-xl overflow-hidden",
            )}
        >
            {/* Toolbar */}
            {showToolbar && (
                <TableToolbar
                    title={title}
                    searchValue={searchValue}
                    onSearch={onSearch}
                    onRefresh={onRefresh}
                    onAdd={onAdd}
                    onImportExcel={onImportExcel}
                    importExcelAccept={importExcelAccept}
                    isImporting={isImporting}
                    showExport={showExport}
                    onExportCsv={
                        onExportCsv
                            ? () => {
                                const selectedRows = table
                                    .getFilteredSelectedRowModel()
                                    .rows.map((r) => r.original);
                                onExportCsv(selectedRows);
                            }
                            : undefined
                    }
                    onExportPdf={onExportPdf}
                    onPrint={onPrint}
                    showFilter={Boolean(filterFields?.length)}
                    filterActive={filterOpen || hasActiveFilters}
                    onFilterToggle={() => setFilterOpen((v) => !v)}
                    filterNode={
                        filterFields ? (
                            <TableFilter
                                open={filterOpen}
                                fields={filterFields}
                                values={filterValues}
                                onChange={(vals) => onFilterChange?.(vals)}
                                onReset={() => onFilterChange?.({})}
                            />
                        ) : undefined
                    }
                    showColumnToggle={showColumnToggle}
                    toggleableColumns={table
                        .getAllLeafColumns()
                        .filter((column) => column.getCanHide() && column.id !== "expander")
                        .map((column) => ({
                            id: column.id,
                            label:
                                typeof column.columnDef.header === "string"
                                    ? column.columnDef.header
                                    : column.id,
                            isVisible: column.getIsVisible(),
                            onToggle: (val) => column.toggleVisibility(!!val),
                        }))}
                    selectedCount={selectedCount}
                    customActions={mergedCustomActions}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                />
            )}

            {/* Loading */}
            {loading && (
                <TableLoading rows={10} columns={columns.length} />
            )}

            {/* Empty State */}
            {showEmptyState &&
                (emptyComponent || (
                    <TableEmpty
                        type={hasActiveFilters ? "no-results" : "empty"}
                        onAction={hasActiveFilters ? undefined : onAdd}
                    />
                ))}

            {/* Table grid */}
            {showTable && (
                <div className="relative flex flex-col flex-1 min-h-0">
                    <Table
                        containerClassName="flex-1 min-h-0"
                        containerStyle={{
                            maxHeight: isFullscreen ? undefined : maxHeight,
                        }}
                        className={cn(dense && "text-xs")}
                        style={{
                            tableLayout: "fixed",
                            width: "100%",
                            minWidth: table.getTotalSize(),
                        }}
                    >
                        <TableHeader
                            className={cn(stickyHeader && "sticky top-0 z-10 bg-card")}
                        >
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-b bg-muted/50 hover:bg-muted/50"
                                >
                                    {headerGroup.headers.map((header, idx) => {
                                        const isTreeCol = treeColumnId
                                            ? header.id === treeColumnId || (header.column.columnDef as any).accessorKey === treeColumnId
                                            : idx === 0;

                                        const align =
                                            (header.column.columnDef.meta as any)?.align ||
                                            (isTreeCol ? "left" : "center");
                                        const alignClass =
                                            align === "left"
                                                ? "text-left"
                                                : align === "right"
                                                    ? "text-right"
                                                    : "text-center";

                                        return (
                                            <TableHead
                                                key={header.id}
                                                style={{
                                                    width: header.getSize(),
                                                    minWidth: (
                                                        header.column.columnDef as { minSize?: number }
                                                    ).minSize,
                                                }}
                                                className={cn(
                                                    "relative px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap border-r last:border-r-0 overflow-hidden text-ellipsis align-middle",
                                                    alignClass,
                                                )}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                {header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className={cn(
                                                            "absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none touch-none",
                                                            "bg-primary/20 opacity-0 hover:opacity-100 transition-opacity",
                                                            header.column.getIsResizing() &&
                                                            "bg-primary opacity-100 w-2 z-10",
                                                        )}
                                                    />
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className={cn(
                                        "transition-colors",
                                        hoverable && "hover:bg-muted/50",
                                        row.getIsSelected() && "bg-muted/80",
                                        striped &&
                                        index % 2 === 1 &&
                                        !row.getIsSelected() &&
                                        "bg-muted/20",
                                    )}
                                >
                                    {row.getVisibleCells().map((cell, idx) => {
                                        const isTreeCol = treeColumnId
                                            ? cell.column.id === treeColumnId || (cell.column.columnDef as any).accessorKey === treeColumnId
                                            : idx === 0;

                                        const align =
                                            (cell.column.columnDef.meta as any)?.align ||
                                            (isTreeCol ? "left" : "center");
                                        const alignClass =
                                            align === "left"
                                                ? "text-left"
                                                : align === "right"
                                                    ? "text-right"
                                                    : "text-center";

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    width: cell.column.getSize(),
                                                    minWidth: (
                                                        cell.column.columnDef as { minSize?: number }
                                                    ).minSize,
                                                }}
                                                className={cn(
                                                    "px-4 py-3 text-sm border-r last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap align-middle",
                                                    alignClass,
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            {showPagination && !loading && data.length > 0 && (
                <TablePagination
                    table={table}
                    totalCount={
                        totalCount ?? (manualPagination ? undefined : data.length)
                    }
                />
            )}
        </motion.div>
    );
}
