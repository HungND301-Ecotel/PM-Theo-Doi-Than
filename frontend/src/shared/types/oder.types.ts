import type { BaseEntity } from './common.types';
import type {
  TransportMode,
  OrderStatus,
  ShiftCode,
  ShiftStatus,
} from '../constants/enums';

// ------------------------------------------------------------
// ImportOrder – Lệnh nhập than
// ------------------------------------------------------------

export interface ImportOrder extends BaseEntity {
  orderNo: string;
  issuedDate: string; // ISO date
  expiryDate?: string; // Ngày hết hạn lệnh
  supplierId: string;
  supplierName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  plannedQty: number; // Tấn
  transportMode: TransportMode;
  warehouseId: string;
  warehouseName?: string;
  status: OrderStatus;
  approvedBy?: string;
}

export interface ImportOrderRequest {
  orderNo: string;
  issuedDate: string;
  expiryDate?: string;
  supplierId: string;
  coalTypeId: string;
  plannedQty: number;
  transportMode: TransportMode;
  warehouseId: string;
}

// ------------------------------------------------------------
// ExportNotice – Thông báo giao than / rót than
// ------------------------------------------------------------

export interface ExportNotice extends BaseEntity {
  noticeNo: string;
  issuedDate: string;
  customerId: string;
  customerName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  plannedQty: number;
  warehouseId: string;
  warehouseName?: string;
  status: OrderStatus;
  approvedBy?: string;
}

export interface ExportNoticeRequest {
  noticeNo: string;
  issuedDate: string;
  customerId: string;
  coalTypeId: string;
  plannedQty: number;
  warehouseId: string;
}

// ------------------------------------------------------------
// ShiftRecord – Bản ghi ca làm việc
// ------------------------------------------------------------

/**
 * Vòng đời ca:
 *   NHAP_LIEU → CHO_PHOI_CAN → DA_CHOT_CA → SAU_DO (NK) → DA_KHOA
 *
 * FE cần:
 *  - Disable form nhập liệu khi status = DA_KHOA
 *  - Chỉ hiện nút "Chốt ca" khi status = NHAP_LIEU | CHO_PHOI_CAN
 *  - Chỉ TK_KT / ADMIN thấy nút "Khóa ca"
 */
export interface ShiftRecord extends BaseEntity {
  warehouseId: string;
  warehouseName?: string;
  shiftNo: ShiftCode;
  shiftDate: string; // ISO date
  status: ShiftStatus;
  akResult?: number; // AK% (sau khi chốt ca)
  wResult?: number; // W% (sau khi chốt ca)
  closedBy?: string;
  closedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
}

export interface ShiftRecordRequest {
  warehouseId: string;
  shiftNo: ShiftCode;
  shiftDate: string;
}

export interface ShiftCloseRequest {
  akResult: number; // 0–100
  wResult: number; // 0–100
}
