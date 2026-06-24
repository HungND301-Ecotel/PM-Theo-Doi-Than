import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Table as TableIcon, Download } from "lucide-react";
import TableToolbar from "../core/TableToolbar";
import TableLoading from "../core/TableLoading";
import TableEmpty from "../core/TableEmpty";
import PivotConfigBar from "./PivotConfigBar";
import PivotGrid from "./PivotGrid";
import PivotDrilldown from "./PivotDrilldown";
import {
  usePivotEngine,
  type PivotField,
  type PivotCell,
  type AggregationType,
  type ConditionalRule,
} from "./usePivotEngine";

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type { PivotField, AggregationType, PivotCell, ConditionalRule };

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PivotTableProps {
  /** Raw data to pivot */
  data: Record<string, unknown>[];
  /** Initial field(s) used for row grouping */
  rowField: PivotField;
  /** Initial field(s) used for column grouping */
  columnField: PivotField;

  /**
   * Single value field (backward compat).
   * Ignored if `valueFields` is provided.
   */
  valueField?: PivotField;
  /** Multiple value fields — displayed as sub-columns */
  valueFields?: PivotField[];

  /** Aggregation function */
  aggregation?: AggregationType;

  /** Available fields for user selection */
  availableRowFields?: PivotField[];
  availableColumnFields?: PivotField[];
  availableValueFields?: PivotField[];

  /** Title */
  title?: string;

  // ── Toolbar ───────────────────────────────────────────────────────────
  showToolbar?: boolean;
  onRefresh?: () => void;
  onImportExcel?: (file: File) => void;
  isImporting?: boolean;
  importExcelLabel?: string;
  importExcelAccept?: string;

  // ── UI options ────────────────────────────────────────────────────────
  loading?: boolean;
  bordered?: boolean;
  maxHeight?: number | string;
  emptyComponent?: React.ReactNode;
  /** Show config bar for field selection */
  showConfig?: boolean;

  // ── Conditional Formatting ───────────────────────────────────────────
  conditionalRules?: ConditionalRule[];

  // ── Drill-down ────────────────────────────────────────────────────────
  enableDrilldown?: boolean;

  // ── Export ─────────────────────────────────────────────────────────────
  /** Override default CSV export */
  onExportCsv?: () => void;

  // ── Custom ─────────────────────────────────────────────────────────────
  renderCell?: (
    value: number,
    cell: PivotCell,
    rowKey: string,
    colKey: string,
    fieldIndex: number,
  ) => React.ReactNode;

  // ── Reserved ──────────────────────────────────────────────────────────
  draggable?: boolean;
  onRegisterExport?: (exportFn: () => void) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PivotTable: React.FC<PivotTableProps> = ({
  data,
  rowField,
  columnField,
  valueField,
  valueFields: valueFieldsProp,
  aggregation: aggregationProp = "sum",

  availableRowFields,
  availableColumnFields,
  availableValueFields,

  title,
  showToolbar = false,
  onRefresh,
  onImportExcel,
  isImporting,
  importExcelAccept,

  loading = false,
  bordered = false,
  maxHeight,
  emptyComponent,
  showConfig = true,

  conditionalRules,

  enableDrilldown = false,
  onExportCsv,
  renderCell,
  onRegisterExport,
}) => {
  // ── Local config state ──────────────────────────────────────────────────
  const [localRowKeys, setLocalRowKeys] = useState<string[]>([rowField.key]);
  const [localColKeys, setLocalColKeys] = useState<string[]>([columnField.key]);

  // Resolve value fields: prefer valueFields (array) over valueField (single)
  const initialValueFields = valueFieldsProp ?? (valueField ? [valueField] : []);
  const [localValueKeys, setLocalValueKeys] = useState<string[]>(
    initialValueFields.map((f) => f.key),
  );
  const [localAgg, setLocalAgg] = useState<AggregationType>(aggregationProp);

  // Resolve active fields from keys
  const allFields = [
    ...(availableRowFields ?? [rowField]),
    ...(availableColumnFields ?? [columnField]),
    ...(availableValueFields ?? initialValueFields),
  ];

  const resolveField = (key: string, fallback: PivotField): PivotField =>
    allFields.find((f) => f.key === key) ?? fallback;

  const activeRowFields = localRowKeys
    .map((k) => resolveField(k, rowField))
    .filter(Boolean);
  const activeColFields = localColKeys
    .map((k) => resolveField(k, columnField))
    .filter(Boolean);
  const activeValueFields = localValueKeys
    .map((k) => resolveField(k, initialValueFields[0]))
    .filter(Boolean);

  // ── Pivot Engine ────────────────────────────────────────────────────────
  const engine = usePivotEngine({
    data,
    rowFields: activeRowFields,
    columnFields: activeColFields,
    valueFields: activeValueFields.length > 0 ? activeValueFields : [{ key: "value", label: "Value" }],
    aggregation: localAgg,
  });

  // ── Drill-down state ────────────────────────────────────────────────────
  const [drilldown, setDrilldown] = useState<{
    open: boolean;
    rowKey: string;
    colKey: string;
    cell: PivotCell | null;
  }>({ open: false, rowKey: "", colKey: "", cell: null });

  const handleCellClick = useCallback(
    (rowKey: string, colKey: string, cell: PivotCell) => {
      if (!enableDrilldown) return;
      setDrilldown({ open: true, rowKey, colKey, cell });
    },
    [enableDrilldown],
  );

  // ── CSV export ──────────────────────────────────────────────────────────
  const handleExportCsv = useCallback(() => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }

    const csv = engine.exportCsv();
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const rowLabel = activeRowFields.map((f) => f.key).join("_");
    const colLabel = activeColFields.map((f) => f.key).join("_");
    link.download = `pivot_${rowLabel}_x_${colLabel}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [engine, onExportCsv, activeRowFields, activeColFields]);

  // Register export callback with parent component
  React.useEffect(() => {
    if (onRegisterExport) {
      onRegisterExport(handleExportCsv);
    }
  }, [onRegisterExport, handleExportCsv]);

  // ── Derived ─────────────────────────────────────────────────────────────
  const isEmpty = data.length === 0 && !loading;
  const hasConfig =
    showConfig &&
    (availableRowFields || availableColumnFields || availableValueFields);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border",
        bordered ? "border-border" : "border-transparent",
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <TableToolbar
          title={title}
          onRefresh={onRefresh}
          onExportCsv={handleExportCsv}
          showExport={true}
          showFilter={false}
          onImportExcel={onImportExcel}
          isImporting={isImporting}
          importExcelAccept={importExcelAccept}
        />
      )}

      {/* Title (khi không có toolbar) */}
      {!showToolbar && title && (
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      )}

      {/* Config bar */}
      {hasConfig && (
        <PivotConfigBar
          rowFieldKeys={localRowKeys}
          onRowFieldsChange={setLocalRowKeys}
          colFieldKeys={localColKeys}
          onColFieldsChange={setLocalColKeys}
          valueFieldKeys={localValueKeys}
          onValueFieldsChange={setLocalValueKeys}
          aggregation={localAgg}
          onAggregationChange={setLocalAgg}
          availableRowFields={availableRowFields}
          availableColumnFields={availableColumnFields}
          availableValueFields={availableValueFields}
        />
      )}

      {/* Loading skeleton */}
      {loading && (
        <TableLoading
          rows={6}
          columns={(engine.columnKeys.length || 3) * activeValueFields.length + 2}
        />
      )}

      {/* Empty state */}
      {isEmpty && (emptyComponent || <TableEmpty type="empty" />)}

      {/* Pivot Grid */}
      {!loading && data.length > 0 && (
        <PivotGrid
          rowKeys={engine.rowKeys}
          columnKeys={engine.columnKeys}
          matrix={engine.matrix}
          rowTotals={engine.rowTotals}
          columnTotals={engine.columnTotals}
          grandTotal={engine.grandTotal}
          valueFields={activeValueFields}
          rowFieldLabel={activeRowFields.map((f) => f.label).join(" / ")}
          columnFieldLabel={activeColFields.map((f) => f.label).join(" / ")}
          formatValue={engine.formatValue}
          conditionalRules={conditionalRules}
          onCellClick={enableDrilldown ? handleCellClick : undefined}
          renderCell={renderCell}
          sortKey={engine.sortKey}
          sortDirection={engine.sortDirection}
          onSort={engine.toggleSort}
          maxHeight={maxHeight}
        />
      )}

      {/* Drill-down Dialog */}
      {enableDrilldown && (
        <PivotDrilldown
          open={drilldown.open}
          onOpenChange={(open) =>
            setDrilldown((prev) => ({ ...prev, open }))
          }
          rowKey={drilldown.rowKey}
          colKey={drilldown.colKey}
          cell={drilldown.cell}
        />
      )}
    </div>
  );
};

export default PivotTable;
