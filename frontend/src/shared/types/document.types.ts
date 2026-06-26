// ============================================================
// CISMS – Document Types (Chứng từ kho)
// Entity: WarehouseReceipt, WarehouseIssue, StockCard, LossRecord
// ============================================================

import type { BaseEntity } from './common.types';
import type { ShiftCode, DocStatus } from '../constants/enums';

// ------------------------------------------------------------
// WarehouseReceipt – Phiếu nhập kho
// ------------------------------------------------------------

/**
 * Stepper ký duyệt (thứ tự bắt buộc, không ký vượt cấp):
 *   DRAFT → PENDING_KCS → PENDING_TK → PENDING_QD → APPROVED
 *
 * FE lưu ý:
 *  - importMode: 1 trong 12 mã từ ImportExportMode
 *  - akPercent / wPercent: lấy từ ShiftRecord.akResult / wResult sau chốt ca
 *  - Phiếu được auto-gen khi ShiftRecord chuyển sang DA_CHOT_CA
 */
export interface WarehouseReceipt extends BaseEntity {
  receiptNo: string;
  importOrderId: string;
  orderNo?: string;
  warehouseId: string;
  warehouseName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  importMode: string; // Mã từ ImportExportMode
  shift: ShiftCode;
  receiptDate: string;
  qty: number; // Khối lượng (tấn)
  akPercent?: number;
  wPercent?: number;
  shiftRecordId: string;
  preparedBy?: string;
  approvedBy?: string;
  status: DocStatus;
}

export interface WarehouseReceiptRequest {
  importOrderId: string;
  warehouseId: string;
  coalTypeId: string;
  importMode: string;
  shift: ShiftCode;
  receiptDate: string;
  qty: number;
  akPercent?: number;
  wPercent?: number;
  shiftRecordId: string;
}

// ------------------------------------------------------------
// WarehouseIssue – Phiếu xuất kho
// ------------------------------------------------------------

export interface WarehouseIssue extends BaseEntity {
  issueNo: string;
  exportNoticeId: string;
  noticeNo?: string;
  warehouseId: string;
  warehouseName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  issueMode: string; // Mã từ ImportExportMode
  shift: ShiftCode;
  issueDate: string;
  qty: number;
  akPercent?: number;
  wPercent?: number;
  shiftRecordId: string;
  customerId: string;
  customerName?: string;
  preparedBy?: string;
  approvedBy?: string;
  status: DocStatus;
}

export interface WarehouseIssueRequest {
  exportNoticeId: string;
  warehouseId: string;
  coalTypeId: string;
  issueMode: string;
  shift: ShiftCode;
  issueDate: string;
  qty: number;
  akPercent?: number;
  wPercent?: number;
  shiftRecordId: string;
  customerId: string;
}

/** Body khi điều chỉnh SAU ĐO (xuất bán) */
export interface WarehouseIssuePostMeasureRequest {
  qtyAdjusted: number;
  reason: string;
}

// ------------------------------------------------------------
// StockCard – Thẻ kho (sổ kho điện tử, read-only)
// ------------------------------------------------------------

/**
 * Read-only – FE chỉ hiển thị, không tạo/sửa trực tiếp
 * Được cập nhật tự động khi ShiftRecord → DA_CHOT_CA
 *
 * Unique constraint: warehouseId + coalTypeId + stockDate
 */
export interface StockCard extends BaseEntity {
  warehouseId: string;
  warehouseName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  stockDate: string;

  openingQty: number; // Tồn đầu

  importQty: number; // Tổng nhập
  importPurchaseQty: number; // Nhập mua (ô tô + NK)
  importTransferQty: number; // Nhập chuyển kho
  importRecoveryQty: number; // Thu hồi khác

  exportQty: number; // Tổng xuất
  exportSaleQty: number; // Xuất bán
  exportTransferQty: number; // Xuất chuyển kho
  exportBlendQty: number; // Xuất pha trộn (Bước 1 + 2)

  lossQty: number; // Hao hụt
  closingQty: number; // Tồn cuối = opening + import - export - loss

  lockedBy?: string;
  lockedAt?: string;
}

// ------------------------------------------------------------
// LossRecord – Bảng kê hao hụt
// ------------------------------------------------------------

export interface LossRecord extends BaseEntity {
  warehouseId: string;
  warehouseName?: string;
  stage: string; // Công đoạn: bốc xếp, tồn kho...
  recordDate: string;
  coalTypeId: string;
  coalTypeName?: string;
  qty: number;
  limitQty: number; // Định mức cho phép
  isOverLimit: boolean;
  overReason?: string; // Bắt buộc khi isOverLimit = true (BR04)
}
