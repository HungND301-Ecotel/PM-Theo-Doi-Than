import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type {
  PivotField,
  PivotCell,
  ConditionalRule,
} from "./usePivotEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PivotGridProps {
  rowKeys: string[];
  columnKeys: string[];
  matrix: Record<string, Record<string, PivotCell>>;
  rowTotals: Record<string, PivotCell>;
  columnTotals: Record<string, PivotCell>;
  grandTotal: PivotCell;
  valueFields: PivotField[];
  rowFieldLabel: string;
  columnFieldLabel: string;
  formatValue: (val: number, fieldIndex: number) => string;
  /** Conditional format rules */
  conditionalRules?: ConditionalRule[];
  /** Drill-down callback */
  onCellClick?: (rowKey: string, colKey: string, cell: PivotCell) => void;
  /** Custom cell renderer */
  renderCell?: (
    value: number,
    cell: PivotCell,
    rowKey: string,
    colKey: string,
    fieldIndex: number,
  ) => React.ReactNode;
  /** Sort state */
  sortKey?: string | null;
  sortDirection?: "asc" | "desc" | null;
  onSort?: (target: string) => void;
  /** Max height for scroll */
  maxHeight?: number | string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getConditionalProps = (
  value: number,
  rules?: ConditionalRule[],
): { className?: string; style?: React.CSSProperties } => {
  if (!rules) return {};
  for (const rule of rules) {
    if (rule.condition(value)) {
      return { className: rule.className, style: rule.style };
    }
  }
  return {};
};

const SortIndicator: React.FC<{
  target: string;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc" | null;
}> = ({ target, sortKey, sortDirection }) => {
  if (sortKey !== target || !sortDirection) {
    return <ArrowUpDown className="inline ml-1 h-3 w-3 text-muted-foreground/40" />;
  }
  return sortDirection === "asc" ? (
    <ArrowUp className="inline ml-1 h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="inline ml-1 h-3 w-3 text-primary" />
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const PivotGrid: React.FC<PivotGridProps> = ({
  rowKeys,
  columnKeys,
  matrix,
  rowTotals,
  columnTotals,
  grandTotal,
  valueFields,
  rowFieldLabel,
  columnFieldLabel,
  formatValue,
  conditionalRules,
  onCellClick,
  renderCell,
  sortKey,
  sortDirection,
  onSort,
  maxHeight,
}) => {
  const isMultiValue = valueFields.length > 1;
  const totalColSpan = valueFields.length;

  // Cell render helper
  const renderCellValue = (
    cell: PivotCell,
    fieldIndex: number,
    rowKey: string,
    colKey: string,
    isTotal: boolean = false,
  ) => {
    const value = cell.values[fieldIndex];

    // Custom render
    if (renderCell && !isTotal) {
      return renderCell(value, cell, rowKey, colKey, fieldIndex);
    }

    // Conditional format
    const condProps = getConditionalProps(value, conditionalRules);

    return (
      <TableCell
        key={`${rowKey}-${colKey}-${fieldIndex}`}
        className={cn(
          "text-right font-mono text-xs px-3 py-2 transition-all duration-200",
          onCellClick && !isTotal && "cursor-pointer hover:bg-primary/10 hover:shadow-inner",
          isTotal && "font-bold bg-muted/30",
          condProps.className,
        )}
        style={condProps.style}
        onClick={
          onCellClick && !isTotal
            ? () => onCellClick(rowKey, colKey, cell)
            : undefined
        }
      >
        {value !== 0 ? (
          formatValue(value, fieldIndex)
        ) : (
          <span className="text-muted-foreground/30">—</span>
        )}
      </TableCell>
    );
  };

  return (
    <div className="overflow-auto" style={{ maxHeight: maxHeight ?? 500 }}>
      <Table className="text-xs">
        <TableHeader>
          {/* Row 1: Column group headers (only when multi-value) */}
          {isMultiValue && (
            <TableRow className="bg-gradient-to-r from-muted/50 to-muted/20 border-b">
              <TableCell
                className="font-bold border-r bg-muted/50 sticky left-0 z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]"
                rowSpan={2}
              >
                <span
                  className={cn(onSort && "cursor-pointer select-none")}
                  onClick={onSort ? () => onSort("row") : undefined}
                >
                  {rowFieldLabel}
                  {onSort && (
                    <SortIndicator
                      target="row"
                      sortKey={sortKey}
                      sortDirection={sortDirection}
                    />
                  )}
                </span>
                {" / "}
                <span
                  className={cn(onSort && "cursor-pointer select-none")}
                  onClick={onSort ? () => onSort("column") : undefined}
                >
                  {columnFieldLabel}
                  {onSort && (
                    <SortIndicator
                      target="column"
                      sortKey={sortKey}
                      sortDirection={sortDirection}
                    />
                  )}
                </span>
              </TableCell>
              {columnKeys.map((ck) => (
                <TableCell
                  key={ck}
                  colSpan={totalColSpan}
                  className="text-center font-semibold whitespace-nowrap border-x"
                >
                  {ck}
                </TableCell>
              ))}
              <TableCell
                colSpan={totalColSpan}
                className="text-center font-bold bg-primary text-primary-foreground shadow-sm"
              >
                Tổng
              </TableCell>
            </TableRow>
          )}

          {/* Row 2: Value field sub-headers (or single header row) */}
          <TableRow className="bg-gradient-to-r from-muted/50 to-muted/20 border-b">
            {!isMultiValue && (
              <TableCell className="font-bold border-r bg-muted/50 sticky left-0 z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                <span
                  className={cn(onSort && "cursor-pointer select-none")}
                  onClick={onSort ? () => onSort("row") : undefined}
                >
                  {rowFieldLabel}
                  {onSort && (
                    <SortIndicator
                      target="row"
                      sortKey={sortKey}
                      sortDirection={sortDirection}
                    />
                  )}
                </span>
                {" / "}
                <span
                  className={cn(onSort && "cursor-pointer select-none")}
                  onClick={onSort ? () => onSort("column") : undefined}
                >
                  {columnFieldLabel}
                  {onSort && (
                    <SortIndicator
                      target="column"
                      sortKey={sortKey}
                      sortDirection={sortDirection}
                    />
                  )}
                </span>
              </TableCell>
            )}

            {columnKeys.map((ck) =>
              valueFields.map((vf, vi) => (
                <TableCell
                  key={`${ck}-${vf.key}`}
                  className={cn(
                    "text-right font-semibold whitespace-nowrap",
                    isMultiValue && vi === 0 && "border-l",
                    onSort && "cursor-pointer select-none hover:text-foreground",
                  )}
                  onClick={onSort ? () => onSort(vf.key) : undefined}
                >
                  {isMultiValue ? vf.label : ck}
                  {onSort && (
                    <SortIndicator
                      target={isMultiValue ? vf.key : vf.key}
                      sortKey={sortKey}
                      sortDirection={sortDirection}
                    />
                  )}
                </TableCell>
              )),
            )}

            {/* Total header(s) */}
            {valueFields.map((vf, vi) => (
              <TableCell
                key={`total-${vf.key}`}
                className={cn(
                  "text-right font-bold shadow-sm",
                  isMultiValue
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-primary text-primary-foreground",
                  isMultiValue && vi === 0 && "border-l border-primary/20",
                )}
              >
                {isMultiValue ? vf.label : "Tổng"}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Data rows */}
          {rowKeys.map((rk) => (
            <TableRow key={rk} className="hover:bg-primary/5 transition-colors group">
              <TableCell className="font-semibold border-r sticky left-0 bg-card group-hover:bg-primary/5 transition-colors z-20 whitespace-nowrap shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                {rk}
              </TableCell>

              {columnKeys.map((ck) =>
                valueFields.map((_, vi) =>
                  renderCellValue(matrix[rk][ck], vi, rk, ck),
                ),
              )}

              {/* Row total */}
              {valueFields.map((_, vi) =>
                renderCellValue(rowTotals[rk], vi, rk, "__total__", true),
              )}
            </TableRow>
          ))}

          {/* Grand total row */}
          <TableRow className="bg-primary/10 hover:bg-primary/15 border-t-2 border-primary/20">
            <TableCell className="font-bold border-r sticky left-0 bg-primary/10 z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
              Tổng cộng
            </TableCell>

            {columnKeys.map((ck) =>
              valueFields.map((_, vi) => (
                <TableCell
                  key={`gt-${ck}-${vi}`}
                  className="text-right font-bold font-mono text-xs px-3 py-2"
                >
                  {formatValue(columnTotals[ck].values[vi], vi)}
                </TableCell>
              )),
            )}

            {/* Grand total corner */}
            {valueFields.map((_, vi) => (
              <TableCell
                key={`gt-total-${vi}`}
                className="text-right font-bold font-mono text-xs px-3 py-2 bg-primary/20"
              >
                {formatValue(grandTotal.values[vi], vi)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PivotGrid;
