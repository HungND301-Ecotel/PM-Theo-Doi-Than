import { useMemo, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PivotField {
  key: string;
  label: string;
  /** Number format type */
  format?: "number" | "currency" | "percent" | "compact";
  /** Currency code when format='currency', e.g. 'VND', 'USD' */
  currencyCode?: string;
  /** Decimal places (default: 0 for number, 2 for currency/percent) */
  decimals?: number;
  /** Locale override, default 'vi-VN' */
  locale?: string;
}

export type AggregationType = "sum" | "count" | "avg" | "min" | "max";

export interface PivotCell {
  /** Aggregated values — one per value field */
  values: number[];
  /** Raw data rows that compose this cell (for drill-down) */
  rawRows: Record<string, unknown>[];
}

export interface ConditionalRule {
  /** Condition function */
  condition: (value: number) => boolean;
  /** Tailwind class names to apply */
  className?: string;
  /** Inline styles to apply */
  style?: React.CSSProperties;
}

export interface UsePivotEngineOptions {
  data: Record<string, unknown>[];
  /** Single row field (backward compat) */
  rowField?: PivotField;
  /** Single column field (backward compat) */
  columnField?: PivotField;
  /** Multiple row fields — composite key joined by ' / ' */
  rowFields?: PivotField[];
  /** Multiple column fields — composite key joined by ' / ' */
  columnFields?: PivotField[];
  valueFields: PivotField[];
  aggregation: AggregationType;
  sortBy?: { field: string; direction: "asc" | "desc" };
}

export interface UsePivotEngineReturn {
  rowKeys: string[];
  columnKeys: string[];
  matrix: Record<string, Record<string, PivotCell>>;
  rowTotals: Record<string, PivotCell>;
  columnTotals: Record<string, PivotCell>;
  grandTotal: PivotCell;
  /** Format a numeric value according to the field's format config */
  formatValue: (val: number, fieldIndex: number) => string;
  /** Generate CSV string from the current pivot data */
  exportCsv: () => string;
  /** Current sort state */
  sortKey: string | null;
  sortDirection: "asc" | "desc" | null;
  /** Toggle sort on a column */
  toggleSort: (target: string) => void;
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

const aggregateFn = (values: number[], fn: AggregationType): number => {
  if (values.length === 0) return 0;
  switch (fn) {
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "count":
      return values.length;
    case "avg":
      return values.reduce((a, b) => a + b, 0) / values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    default:
      return values.reduce((a, b) => a + b, 0);
  }
};

// ─── Number Formatting ───────────────────────────────────────────────────────

const createFormatter = (field: PivotField): ((val: number) => string) => {
  const locale = field.locale || "vi-VN";
  const format = field.format || "number";

  switch (format) {
    case "currency": {
      const fmt = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: field.currencyCode || "VND",
        minimumFractionDigits: field.decimals ?? 0,
        maximumFractionDigits: field.decimals ?? 0,
      });
      return (val: number) => fmt.format(val);
    }
    case "percent": {
      const fmt = new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: field.decimals ?? 1,
        maximumFractionDigits: field.decimals ?? 1,
      });
      return (val: number) => fmt.format(val / 100);
    }
    case "compact": {
      const fmt = new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
        minimumFractionDigits: field.decimals ?? 1,
        maximumFractionDigits: field.decimals ?? 1,
      });
      return (val: number) => fmt.format(val);
    }
    default: {
      const fmt = new Intl.NumberFormat(locale, {
        minimumFractionDigits: field.decimals ?? 0,
        maximumFractionDigits: field.decimals ?? 2,
      });
      return (val: number) => fmt.format(val);
    }
  }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePivotEngine({
  data,
  rowField,
  columnField,
  rowFields: rowFieldsProp,
  columnFields: columnFieldsProp,
  valueFields,
  aggregation,
  sortBy: initialSortBy,
}: UsePivotEngineOptions): UsePivotEngineReturn {
  // Resolve arrays — prefer arrays, fall back to single field wrapped in array
  const rowFields = rowFieldsProp ?? (rowField ? [rowField] : []);
  const columnFields = columnFieldsProp ?? (columnField ? [columnField] : []);
  // Sort state
  const [sortKey, setSortKey] = useState<string | null>(
    initialSortBy?.field ?? null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    initialSortBy?.direction ?? null,
  );

  // Formatters (memoized)
  const formatters = useMemo(
    () => valueFields.map((f) => createFormatter(f)),
    [valueFields],
  );

  const formatValue = useCallback(
    (val: number, fieldIndex: number): string => {
      const formatter = formatters[fieldIndex];
      return formatter ? formatter(val) : String(val);
    },
    [formatters],
  );

  // Core pivot computation
  const pivotResult = useMemo(() => {
    // ─── Step 1: Build raw matrix ──────────────────────────────────────
    const rowKeySet = new Set<string>();
    const colKeySet = new Set<string>();

    // Intermediate: [row][col] → array of raw values per value field
    const rawMatrix: Record<
      string,
      Record<string, { valuesPerField: number[][]; rawRows: Record<string, unknown>[] }>
    > = {};

    for (const row of data) {
      const rk = rowFields.map((f) => String(row[f.key] ?? "")).join(" / ");
      const ck = columnFields.map((f) => String(row[f.key] ?? "")).join(" / ");
      rowKeySet.add(rk);
      colKeySet.add(ck);

      if (!rawMatrix[rk]) rawMatrix[rk] = {};
      if (!rawMatrix[rk][ck]) {
        rawMatrix[rk][ck] = {
          valuesPerField: valueFields.map(() => []),
          rawRows: [],
        };
      }

      rawMatrix[rk][ck].rawRows.push(row);
      valueFields.forEach((vf, i) => {
        rawMatrix[rk][ck].valuesPerField[i].push(Number(row[vf.key]) || 0);
      });
    }

    let rowKeys = [...rowKeySet].sort();
    let columnKeys = [...colKeySet].sort();

    // ─── Step 2: Aggregate ────────────────────────────────────────────
    const matrix: Record<string, Record<string, PivotCell>> = {};
    const rowTotals: Record<string, PivotCell> = {};
    const columnTotals: Record<string, PivotCell> = {};

    // Build cells
    for (const rk of rowKeys) {
      matrix[rk] = {};
      const rowTotalValuesPerField: number[][] = valueFields.map(() => []);
      const rowTotalRawRows: Record<string, unknown>[] = [];

      for (const ck of columnKeys) {
        const raw = rawMatrix[rk]?.[ck];
        const values = valueFields.map((_, i) =>
          raw ? aggregateFn(raw.valuesPerField[i], aggregation) : 0,
        );
        const rawRows = raw?.rawRows ?? [];

        matrix[rk][ck] = { values, rawRows };

        // Accumulate for row totals
        rawRows.forEach((r) => rowTotalRawRows.push(r));
        values.forEach((v, i) => rowTotalValuesPerField[i].push(v));
      }

      rowTotals[rk] = {
        values: rowTotalValuesPerField.map((arr) =>
          aggregation === "avg"
            ? arr.reduce((a, b) => a + b, 0) / (arr.filter(v => v !== 0).length || 1)
            : arr.reduce((a, b) => a + b, 0),
        ),
        rawRows: rowTotalRawRows,
      };
    }

    // Column totals
    for (const ck of columnKeys) {
      const colTotalRawRows: Record<string, unknown>[] = [];
      const colValues: number[] = valueFields.map((_, i) => {
        const vals = rowKeys.map((rk) => matrix[rk][ck].values[i]);
        return aggregation === "avg"
          ? vals.reduce((a, b) => a + b, 0) / (vals.filter(v => v !== 0).length || 1)
          : vals.reduce((a, b) => a + b, 0);
      });

      rowKeys.forEach((rk) => {
        matrix[rk][ck].rawRows.forEach((r) => colTotalRawRows.push(r));
      });

      columnTotals[ck] = { values: colValues, rawRows: colTotalRawRows };
    }

    // Grand total
    const grandTotal: PivotCell = {
      values: valueFields.map((_, i) => {
        const allVals = rowKeys.map((rk) => rowTotals[rk].values[i]);
        return aggregation === "avg"
          ? allVals.reduce((a, b) => a + b, 0) / (allVals.filter(v => v !== 0).length || 1)
          : allVals.reduce((a, b) => a + b, 0);
      }),
      rawRows: data as Record<string, unknown>[],
    };

    // ─── Step 3: Sorting ──────────────────────────────────────────────
    if (sortKey && sortDirection) {
      if (sortKey === "row") {
        rowKeys = [...rowKeys].sort((a, b) =>
          sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a),
        );
      } else if (sortKey === "column") {
        columnKeys = [...columnKeys].sort((a, b) =>
          sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a),
        );
      } else {
        // Sort rows by a value field's total
        const fieldIdx = valueFields.findIndex((f) => f.key === sortKey);
        if (fieldIdx >= 0) {
          rowKeys = [...rowKeys].sort((a, b) => {
            const aVal = rowTotals[a].values[fieldIdx];
            const bVal = rowTotals[b].values[fieldIdx];
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
          });
        }
      }
    }

    return { rowKeys, columnKeys, matrix, rowTotals, columnTotals, grandTotal };
  }, [data, rowFields, columnFields, valueFields, aggregation, sortKey, sortDirection]);

  // CSV Export
  const exportCsv = useCallback((): string => {
    const { rowKeys, columnKeys, matrix, rowTotals, grandTotal } = pivotResult;
    const lines: string[] = [];

    // Header row
    const rowLabel = rowFields.map((f) => f.label).join(" / ");
    const colLabel = columnFields.map((f) => f.label).join(" / ");
    const headerCells = [
      `${rowLabel} / ${colLabel}`,
      ...columnKeys.flatMap((ck) =>
        valueFields.map((vf) =>
          valueFields.length > 1 ? `${ck} - ${vf.label}` : ck,
        ),
      ),
      ...valueFields.map((vf) =>
        valueFields.length > 1 ? `Tổng - ${vf.label}` : "Tổng",
      ),
    ];
    lines.push(headerCells.join(","));

    // Data rows
    for (const rk of rowKeys) {
      const cells = [
        rk,
        ...columnKeys.flatMap((ck) =>
          matrix[rk][ck].values.map((v) => String(v)),
        ),
        ...rowTotals[rk].values.map((v) => String(v)),
      ];
      lines.push(cells.join(","));
    }

    // Grand total row
    const totalCells = [
      "Tổng cộng",
      ...columnKeys.flatMap((ck) =>
        pivotResult.columnTotals[ck].values.map((v) => String(v)),
      ),
      ...grandTotal.values.map((v) => String(v)),
    ];
    lines.push(totalCells.join(","));

    return lines.join("\n");
  }, [pivotResult, rowFields, columnFields, valueFields]);

  // Sort toggle
  const toggleSort = useCallback(
    (target: string) => {
      if (sortKey === target) {
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else {
          setSortKey(null);
          setSortDirection(null);
        }
      } else {
        setSortKey(target);
        setSortDirection("asc");
      }
    },
    [sortKey, sortDirection],
  );

  return {
    ...pivotResult,
    formatValue,
    exportCsv,
    sortKey,
    sortDirection,
    toggleSort,
  };
}
