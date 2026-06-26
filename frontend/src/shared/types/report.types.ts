// ============================================================
// CISMS – Report & Reconciliation Types
// Entity: UnitSummary, CompanySummary, Reconciliation,
//         AcceptanceRecord, TkvReport, AuditLog
// ============================================================

import type { BaseEntity } from './common.types';
import type { AuditAction } from '../constants/enums';

// ------------------------------------------------------------
// Report filter params (dùng chung cho các báo cáo)
// ------------------------------------------------------------

export interface ReportFilterParams {
  warehouseId?: string;
  coalTypeId?: string;
  fromDate?: string; // ISO date
  toDate?: string;
  year?: number;
  month?: number; // 1–12
}

// ------------------------------------------------------------
// UnitSummary – Báo cáo N-X-T cấp đơn vị
// ------------------------------------------------------------

export interface UnitSummaryRow {
  coalTypeId: string;
  coalTypeName: string;
  openingQty: number;
  importQty: number;
  exportQty: number;
  lossQty: number;
  closingQty: number;
}

export interface UnitSummary {
  warehouseId: string;
  warehouseName: string;
  period: string; // VD: "2026-06"
  rows: UnitSummaryRow[];
}

// ------------------------------------------------------------
// CompanySummary – Báo cáo N-X-T toàn công ty
// ------------------------------------------------------------

export interface CompanySummaryRow extends UnitSummaryRow {
  warehouseId: string;
  warehouseName: string;
}

export interface CompanySummary {
  period: string;
  rows: CompanySummaryRow[];
}

// ------------------------------------------------------------
// DailyReport – BC sản lượng hàng ngày (BK BC-NN-01)
// ------------------------------------------------------------

export interface DailyReportRow {
  shift: string;
  noticeNo: string; // Số TB rót
  coalSource: string; // Nguồn than
  warehouseName: string;
  coalTypeName: string;
  customerName: string;
  importQty: number;
  exportQty: number; // Thẳng / kho / cộng / mớn
}

// ------------------------------------------------------------
// WarehouseStockReport – BC chủng loại than kho (BK BC-KHO-01)
// ------------------------------------------------------------

export interface WarehouseStockRow {
  coalTypeName: string;
  openingQty: number;
  importByUnit: number;
  importDirectQty: number; // Đổ thẳng
  importThirdPartyQty: number; // Tay ba
  blendQty: number; // Chế biến
  exportQty: number; // Tiêu thụ
  closingQty: number;
}

// ------------------------------------------------------------
// Reconciliation – Đối chiếu Thống kê – Kế toán
// ------------------------------------------------------------

export interface Reconciliation extends BaseEntity {
  period: string;
  type: string; // MUA / BAN
  warehouseId: string;
  coalTypeId: string;
  partnerId: string;
  qtyStatistic: number; // Số liệu TK
  qtyAccounting: number; // Số liệu KT (nhập bởi KT_MH / KT_BH)
  diffQty: number; // = qtyStatistic - qtyAccounting
  status: 'PENDING' | 'MATCHED' | 'UNMATCHED';
}

// ------------------------------------------------------------
// AcceptanceRecord – Biên bản nghiệm thu
// ------------------------------------------------------------

export interface AcceptanceRecord extends BaseEntity {
  recordNo: string;
  type: string; // KIEM_KE / GIAO_NHAN...
  partnerId: string;
  partnerName?: string;
  recordDate: string;
  status: 'DRAFT' | 'SIGNED';
}

// ------------------------------------------------------------
// TkvReport – Báo cáo gửi Ban TKV
// ------------------------------------------------------------

export interface TkvReport extends BaseEntity {
  type: string;
  period: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  submittedBy?: string;
  submittedAt?: string;
}

// ------------------------------------------------------------
// AuditLog – Nhật ký thao tác (read-only)
// ------------------------------------------------------------

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  changedBy: string;
  changedAt: string;
  ipAddress: string;
}
