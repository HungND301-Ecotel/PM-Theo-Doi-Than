export interface ExcelColumnDef {
  field: string;
  headerName?: string;
  width?: number;
}

export function transformToSheetData(columns: ExcelColumnDef[], rows: any[]) {
  const celldata: any[] = [];
  
  // Create headers in row 0
  columns.forEach((col, cIndex) => {
    celldata.push({
      r: 0,
      c: cIndex,
      v: {
        v: col.headerName || col.field,
        m: String(col.headerName || col.field),
        bl: 1, // bold font
        fc: "#333", // font color
        bg: "#f3f4f6", // background color (Tailwind gray-100)
      }
    });
  });

  // Create data in subsequent rows
  rows.forEach((row, rIndex) => {
    columns.forEach((col, cIndex) => {
      const value = row[col.field];
      if (value !== undefined && value !== null) {
        celldata.push({
          r: rIndex + 1,
          c: cIndex,
          v: {
            v: value,
            m: String(value)
          }
        });
      }
    });
  });

  return celldata;
}

export function extractDataFromSheet(sheetData: any, columns: ExcelColumnDef[]) {
  // If no data, return empty array
  if (!sheetData || !sheetData.data || sheetData.data.length === 0) {
    return [];
  }

  const result: any[] = [];
  const matrix = sheetData.data; // 2D array of cells

  // Skip row 0 (headers)
  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r];
    // Check if row is empty
    const isEmpty = row.every((cell: any) => !cell || (cell.v === null || cell.v === undefined || cell.v === ""));
    if (isEmpty) continue;

    const rowObj: any = {};
    columns.forEach((col, cIndex) => {
      const cell = row[cIndex];
      rowObj[col.field] = cell ? cell.v : null;
    });
    result.push(rowObj);
  }

  return result;
}
