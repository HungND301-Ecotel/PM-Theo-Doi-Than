import type { BaseEntity, Activatable } from './common.types';
import type {
  WarehouseType,
  PartnerType,
  ImportExportDirection,
  PeriodStatus,
} from '../constants/enums';

// ------------------------------------------------------------
// CoalType – Chủng loại than
// ------------------------------------------------------------

export interface CoalType extends BaseEntity, Activatable {
  code: string;
  name: string;
  grade: string;
  heatValue: number; // Nhiệt trị (kcal/kg)
  ashContent: number; // Độ tro Ak (%)
  moisture: number; // Độ ẩm W (%)
}

export interface CoalTypeRequest {
  code: string;
  name: string;
  grade: string;
  heatValue: number;
  ashContent: number;
  moisture: number;
  active: boolean;
}

// ------------------------------------------------------------
// Warehouse – Kho cảng / Phân xưởng
// ------------------------------------------------------------

export interface Warehouse extends BaseEntity, Activatable {
  code: string;
  name: string;
  location: string;
  capacity: number; // Sức chứa (tấn)
  type: WarehouseType;
}

export interface WarehouseRequest {
  code: string;
  name: string;
  location: string;
  capacity: number;
  type: WarehouseType;
  active: boolean;
}

// ------------------------------------------------------------
// Partner – Khách hàng / Nhà cung cấp
// ------------------------------------------------------------

export interface Partner extends BaseEntity, Activatable {
  code: string;
  name: string;
  type: PartnerType;
  group: string; // Nhóm phân loại nội bộ
  taxCode: string;
}

export interface PartnerRequest {
  code: string;
  name: string;
  type: PartnerType;
  group: string;
  taxCode: string;
  active: boolean;
}

// ------------------------------------------------------------
// ImportExportMode – Hình thức N-X (12 mã, danh mục mới)
// ------------------------------------------------------------

export interface ImportExportMode extends BaseEntity, Activatable {
  code: string; // VD: NK-OTO-DO-KHO, XK-TAU-THANG...
  name: string;
  direction: ImportExportDirection;
  description: string;
}

export interface ImportExportModeRequest {
  code: string;
  name: string;
  direction: ImportExportDirection;
  description: string;
  active: boolean;
}

// ------------------------------------------------------------
// Vehicle – Phương tiện vận chuyển
// ------------------------------------------------------------

export interface Vehicle extends BaseEntity, Activatable {
  code: string;
  type: string; // Xe tải, tàu, băng tải...
}

// ------------------------------------------------------------
// LossStandard – Định mức hao hụt TKV
// ------------------------------------------------------------

export interface LossStandard extends BaseEntity {
  stage: string; // Công đoạn (bốc xếp, tồn kho...)
  coalTypeId: string;
  coalTypeName?: string; // Populate từ join
  lossPercent: number; // %
  effectiveFrom: string; // ISO date
  effectiveTo?: string;
}

// ------------------------------------------------------------
// AccountingPeriod – Kỳ kế toán
// ------------------------------------------------------------

export interface AccountingPeriod extends BaseEntity {
  year: number;
  month: number; // 1–12
  status: PeriodStatus;
  lockedBy?: string; // user UUID
  lockedAt?: string;
}
