// ============================================================
// CISMS – Transaction Types (nghiệp vụ N-X đặc thù)
// Entity: ImportTruckDetail, TransferWarehouse,
//         BlendPlan / BlendStep1 / BlendStep2, ImportNkVessel
// ============================================================

import type { BaseEntity } from './common.types';
import type {
  ShiftCode,
  TruckStatus,
  TruckImportMode,
  TransferType,
  BlendPlanStatus,
} from '../constants/enums';

// ------------------------------------------------------------
// ImportTruckDetail – Từng chuyến xe ô tô nhập mua
// ------------------------------------------------------------

/**
 * FE lưu ý:
 *  - weightDiff = weightWarehouse - weightMine (BE tự tính, FE readonly)
 *  - Highlight đỏ khi |weightDiff / weightMine| vượt ngưỡng TKV (BR10)
 *  - Batch form: nhập nhiều dòng cùng lúc → POST /import-truck-details/batch
 */
export interface ImportTruckDetail extends BaseEntity {
  importOrderId: string;
  orderNo?: string;
  spnk: string; // Số phiếu nhập kho chuyến xe
  shift: ShiftCode;
  transactionDate: string;
  companyName: string; // VD: Cao Sơn, Đèo Nai-C6...
  warehouseId: string;
  warehouseName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  importMode: TruckImportMode;
  weightMine: number; // Cân tại mỏ (tấn)
  weightWarehouse: number; // Cân tại kho (tấn)
  weightDiff: number; // = weightWarehouse - weightMine (readonly)
  status: TruckStatus;
  shiftRecordId: string;
  receiptId?: string; // Nullable – sinh sau khi chốt ca
  /** True khi |weightDiff / weightMine| > ngưỡng TKV */
  isDiffWarning?: boolean;
}

export interface ImportTruckDetailRequest {
  importOrderId: string;
  spnk: string;
  shift: ShiftCode;
  transactionDate: string;
  companyName: string;
  warehouseId: string;
  coalTypeId: string;
  importMode: TruckImportMode;
  weightMine: number;
  weightWarehouse: number;
}

// ------------------------------------------------------------
// TransferWarehouse – Chuyển kho nội bộ
// ------------------------------------------------------------

/**
 * qtyAdjustment và qtyNormalized do BE tự tính (MoistureUtils) – FE readonly
 */
export interface TransferWarehouse extends BaseEntity {
  transferNo: string;
  fromWarehouseId: string;
  fromWarehouseName?: string;
  toWarehouseId: string;
  toWarehouseName?: string;
  coalTypeId: string;
  coalTypeName?: string;
  transferDate: string;
  qtyWeighed: number; // SL cân (tấn)
  akPercent: number;
  wPercent: number;
  qtyAdjustment: number; // Cộng/trừ quy ẩm (readonly)
  qtyNormalized: number; // SL quy ẩm 8.5% (readonly)
  type: TransferType;
  note?: string;
  issueId?: string; // → WarehouseIssue kho xuất
  receiptId?: string; // → WarehouseReceipt kho nhập
}

export interface TransferWarehouseRequest {
  transferNo: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  coalTypeId: string;
  transferDate: string;
  qtyWeighed: number;
  akPercent: number;
  wPercent: number;
  type: TransferType;
  note?: string;
}

// ------------------------------------------------------------
// BlendPlan – Phương án pha trộn
// ------------------------------------------------------------

export interface BlendComponent {
  coalTypeId: string;
  coalTypeName?: string;
  ratioPercent: number;
  qtyPlanned: number;
}

export interface BlendPlan extends BaseEntity {
  planDate: string;
  productCode: string; // VD: 6A.10, 6A.14...
  targetQty: number;
  components: BlendComponent[]; // Từ componentsJson (BE parse sang array)
  approvedBy?: string;
  status: BlendPlanStatus;
}

export interface BlendPlanRequest {
  planDate: string;
  productCode: string;
  targetQty: number;
  components: Omit<BlendComponent, 'coalTypeName'>[];
}

// ------------------------------------------------------------
// BlendStep1 – Pha trộn Bước 1 (nghiền / gom than đầu vào)
// ------------------------------------------------------------

export interface BlendStep1 extends BaseEntity {
  planId: string;
  spxk: string; // Số phiếu xuất kho
  shift: ShiftCode;
  date: string;
  vehicle: string; // Số ô tô
  componentCoalTypeId: string;
  componentCoalTypeName?: string;
  qtyWeighed: number;
  totalStep1: number; // Tổng bước 1 tích lũy
  qtyPostMilling: number; // SL sau nghiền
  issueId?: string;
}

export interface BlendStep1Request {
  spxk: string;
  shift: ShiftCode;
  date: string;
  vehicle: string;
  componentCoalTypeId: string;
  qtyWeighed: number;
  qtyPostMilling: number;
}

// ------------------------------------------------------------
// BlendStep2 – Pha trộn Bước 2 (xuất thành phẩm)
// ------------------------------------------------------------

export interface BlendStep2 extends BaseEntity {
  planId: string;
  spxk: string;
  shift: ShiftCode;
  date: string;
  importOrderId: string;
  vesselName: string;
  customerId: string;
  customerName?: string;
  household: string; // Hộ tiêu thụ: TD / PT / Đạm...
  deliveryMode: string;
  coalProductCode: string; // Mã than thành phẩm
  qtyWeighed: number;
  akPercent: number;
  wPercent: number;
  issueId?: string;
}

export interface BlendStep2Request {
  spxk: string;
  shift: ShiftCode;
  date: string;
  importOrderId: string;
  vesselName: string;
  customerId: string;
  household: string;
  deliveryMode: string;
  coalProductCode: string;
  qtyWeighed: number;
  akPercent: number;
  wPercent: number;
}

// ------------------------------------------------------------
// ImportNkVessel – Than nhập khẩu đo mớn tàu
// ------------------------------------------------------------

/**
 * isPostMeasure:
 *  - false = lần đầu nhập
 *  - true  = điều chỉnh SAU ĐO → BE lưu prePostDiff vào lịch sử
 *
 * FE cần hiển thị prePostDiff khi isPostMeasure = true
 */
export interface ImportNkVessel extends BaseEntity {
  importOrderId: string;
  vesselName: string;
  coalTypeId: string;
  coalTypeName?: string;
  transactionDate: string;
  qtyPlan: number;
  draft: number; // Mớn mạn thực tế (m)
  akPercent: number;
  wPercent: number;
  vk?: number; // Độ bay hơi
  sk?: number; // Lưu huỳnh
  qk?: number; // Nhiệt năng
  sizeGt15?: number; // Tỷ lệ cỡ >15mm (%)
  sizeLt15?: number; // Tỷ lệ cỡ <15mm (%)
  qtyActual: number; // SL mớn thực tế tại kho
  isPostMeasure: boolean;
  prePostDiff?: number; // Chênh lệch trước-sau đo (readonly)
  receiptId?: string;
}

export interface ImportNkVesselRequest {
  importOrderId: string;
  vesselName: string;
  coalTypeId: string;
  transactionDate: string;
  qtyPlan: number;
  draft: number;
  akPercent: number;
  wPercent: number;
  vk?: number;
  sk?: number;
  qk?: number;
  sizeGt15?: number;
  sizeLt15?: number;
  qtyActual: number;
  isPostMeasure: boolean;
}
