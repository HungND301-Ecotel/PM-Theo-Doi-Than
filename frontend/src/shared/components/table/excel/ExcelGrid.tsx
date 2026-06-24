import React, { useMemo, useRef } from "react";
import { Workbook } from "@fortune-sheet/react";
import type { WorkbookInstance } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import {
  type ExcelColumnDef,
  transformToSheetData,
  extractDataFromSheet,
} from "./utils";

export interface ExcelGridProps {
  columns?: ExcelColumnDef[];
  rows?: any[];
  data?: any[]; // Raw FortuneSheet data array
  title?: string;
  height?: number | string;
  onChange?: (data: any[]) => void;
}

const ExcelGrid: React.FC<ExcelGridProps> = ({
  columns = [],
  rows = [],
  data,
  title = "Bảng Tính",
  height = 600,
  onChange,
}) => {
  const workbookRef = useRef<WorkbookInstance>(null);

  // Biến đổi data từ dạng array of objects sang cấu trúc cell của FortuneSheet
  const sheetData = useMemo(() => {
    if (data) return data;

    const celldata = transformToSheetData(columns, rows);

    // Xử lý độ rộng cột nếu có
    const columnlen: Record<string, number> = {};
    columns.forEach((col, idx) => {
      if (col.width) {
        columnlen[idx] = col.width;
      }
    });

    return [
      {
        name: title,
        celldata,
        config: {
          columnlen,
        },
      },
    ];
  }, [columns, rows, data, title]);

  return (
    <div
      className="bg-background rounded-xl border shadow-sm overflow-hidden flex flex-col"
      style={{ height }}
    >
      {/* 
        isolation: isolate giúp các z-index của FortuneSheet không bị rò rỉ ra ngoài 
        gây đè lên các popup của Shadcn/Tailwind
      */}
      <div
        className="flex-1 w-full h-full relative"
        style={{ isolation: "isolate" }}
      >
        <Workbook
          ref={workbookRef}
          data={sheetData}
          lang="en"
          onChange={(sheetData: any[]) => {
            if (onChange && columns.length > 0) {
              const currentSheet = sheetData[0];
              const extracted = extractDataFromSheet(currentSheet, columns);
              onChange(extracted);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExcelGrid;
