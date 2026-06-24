import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PivotField, AggregationType } from "./usePivotEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PivotConfigBarProps {
  /** Current row field keys (multi-select) */
  rowFieldKeys: string[];
  onRowFieldsChange: (keys: string[]) => void;
  /** Current column field keys (multi-select) */
  colFieldKeys: string[];
  onColFieldsChange: (keys: string[]) => void;
  /** Current value field keys (multi-select) */
  valueFieldKeys: string[];
  onValueFieldsChange: (keys: string[]) => void;
  /** Current aggregation */
  aggregation: AggregationType;
  onAggregationChange: (agg: AggregationType) => void;
  /** Available fields */
  availableRowFields?: PivotField[];
  availableColumnFields?: PivotField[];
  availableValueFields?: PivotField[];
}

// ─── Multi-select Popover ─────────────────────────────────────────────────────

interface MultiFieldSelectProps {
  label: string;
  dotColor: string;
  selectedKeys: string[];
  fields: PivotField[];
  onChange: (keys: string[]) => void;
}

function MultiFieldSelect({ label, dotColor, selectedKeys, fields, onChange }: MultiFieldSelectProps) {
  const toggleField = (key: string) => {
    if (selectedKeys.includes(key)) {
      // Don't allow removing the last field
      if (selectedKeys.length > 1) {
        onChange(selectedKeys.filter((k) => k !== key));
      }
    } else {
      onChange([...selectedKeys, key]);
    }
  };

  const selectedLabels = fields
    .filter((f) => selectedKeys.includes(f.key))
    .map((f) => f.label);

  const displayText =
    selectedLabels.length === 0
      ? "Chọn trường..."
      : selectedLabels.length <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels.length} trường`;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[10px] tracking-wider uppercase text-muted-foreground font-bold flex items-center gap-1">
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center justify-between gap-2",
              "h-9 min-w-[140px] max-w-[220px] px-3 rounded-lg border border-input bg-background",
              "text-sm text-left hover:bg-muted/50 transition-colors cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          <div className="space-y-1">
            {fields.map((f) => {
              const isSelected = selectedKeys.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleField(f.key)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-4 h-4 rounded border transition-colors shrink-0",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  {f.label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const PivotConfigBar: React.FC<PivotConfigBarProps> = ({
  rowFieldKeys,
  onRowFieldsChange,
  colFieldKeys,
  onColFieldsChange,
  valueFieldKeys,
  onValueFieldsChange,
  aggregation,
  onAggregationChange,
  availableRowFields,
  availableColumnFields,
  availableValueFields,
}) => {
  const toggleValueField = (key: string) => {
    if (valueFieldKeys.includes(key)) {
      if (valueFieldKeys.length > 1) {
        onValueFieldsChange(valueFieldKeys.filter((k) => k !== key));
      }
    } else {
      onValueFieldsChange([...valueFieldKeys, key]);
    }
  };

  const hasConfig =
    availableRowFields || availableColumnFields || availableValueFields;

  if (!hasConfig) return null;

  return (
    <div className="flex flex-wrap items-end gap-5 px-5 py-4 bg-card/60 backdrop-blur-md border-b">
      {/* Row fields (multi-select) */}
      {availableRowFields && (
        <MultiFieldSelect
          label="Hàng"
          dotColor="bg-blue-500/60"
          selectedKeys={rowFieldKeys}
          fields={availableRowFields}
          onChange={onRowFieldsChange}
        />
      )}

      {/* Column fields (multi-select) */}
      {availableColumnFields && (
        <MultiFieldSelect
          label="Cột"
          dotColor="bg-emerald-500/60"
          selectedKeys={colFieldKeys}
          fields={availableColumnFields}
          onChange={onColFieldsChange}
        />
      )}

      {/* Value fields (multi-select via pills) */}
      {availableValueFields && (
        <div className="flex flex-col gap-2">
          <Label className="text-[10px] tracking-wider uppercase text-muted-foreground font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            Giá trị
          </Label>
          <div className="flex items-center gap-2 flex-wrap">
            {availableValueFields.map((f) => {
              const isActive = valueFieldKeys.includes(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggleValueField(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-background text-muted-foreground border-input hover:bg-muted/50 hover:border-border"
                    }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Aggregation */}
      <div className="flex flex-col gap-2">
        <Label className="text-[10px] tracking-wider uppercase text-muted-foreground font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
          Hàm
        </Label>
        <Select
          value={aggregation}
          onValueChange={(val) => onAggregationChange(val as AggregationType)}
        >
          <SelectTrigger className="h-9 w-[120px] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sum">Tổng</SelectItem>
            <SelectItem value="count">Đếm</SelectItem>
            <SelectItem value="avg">Trung bình</SelectItem>
            <SelectItem value="min">Nhỏ nhất</SelectItem>
            <SelectItem value="max">Lớn nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PivotConfigBar;
