import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type { PivotCell } from "./usePivotEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PivotDrilldownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowKey: string;
  colKey: string;
  cell: PivotCell | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PivotDrilldown: React.FC<PivotDrilldownProps> = ({
  open,
  onOpenChange,
  rowKey,
  colKey,
  cell,
}) => {
  if (!cell || cell.rawRows.length === 0) return null;

  // Infer columns from the first raw row
  const columns = Object.keys(cell.rawRows[0]).filter(
    (k) => !k.startsWith("_"),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-6 rounded-2xl gap-6">
        <DialogHeader className="border-b pb-4 space-y-3">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-md text-sm border border-blue-500/20 shadow-sm">{rowKey}</span>
              <span className="text-muted-foreground font-light text-base">×</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-md text-sm border border-emerald-500/20 shadow-sm">{colKey}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Đang hiển thị {cell.rawRows.length} bản ghi chi tiết
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto flex-1 border rounded-xl shadow-inner bg-background">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-primary/10 to-primary/5 hover:bg-primary/10 border-b-primary/10">
                <TableHead className="px-3 py-2 font-bold text-primary w-[50px] rounded-tl-xl">
                  #
                </TableHead>
                {columns.map((col) => (
                  <TableHead
                    key={col}
                    className="px-3 py-2 font-bold text-primary whitespace-nowrap"
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cell.rawRows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-primary/5 transition-colors">
                  <TableCell className="px-3 py-2 text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col}
                      className="px-3 py-2 whitespace-nowrap"
                    >
                      {String(row[col] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PivotDrilldown;
