export enum Role {
  ADMIN = 'ROLE_ADMIN',
  DKSX = 'ROLE_DKSX',
  DKSX_MGR = 'ROLE_DKSX_MGR',
  TK_DV = 'ROLE_TK_DV',
  TK_DV_MGR = 'ROLE_TK_DV_MGR',
  TK_KT = 'ROLE_TK_KT',
  TK_KT_MGR = 'ROLE_TK_KT_MGR',
  KT_MH = 'ROLE_KT_MH',
  KT_BH = 'ROLE_KT_BH',
  LEADER = 'ROLE_LEADER',
  VIEWER = 'ROLE_VIEWER',
}

// ------------------------------------------------------------
// Master data
// ------------------------------------------------------------

/** Loại kho cảng */
export enum WarehouseType {
  PORT = 'PORT', // Kho cảng
  WORKSHOP = 'WORKSHOP', // Phân xưởng giao nhận
}

/** Loại đối tác (KH / NCC) */
export enum PartnerType {
  CUSTOMER = 'CUSTOMER', // Khách hàng
  SUPPLIER = 'SUPPLIER', // Nhà cung cấp
}

/**
 * Chiều hình thức N-X
 *
 * ⚠️ TODO: enum ImportExportMode (12 mã hình thức N-X đầy đủ) chưa được
 * định nghĩa do thiếu spec nghiệp vụ từ BE. importMode/issueMode ở
 * document.types.ts hiện tạm dùng `string`. Cần bổ sung khi có đủ spec.
 */
export enum ImportExportDirection {
  IN = 'IN',
  OUT = 'OUT',
  BOTH = 'BOTH',
}

// ------------------------------------------------------------
// Lệnh nhập / Thông báo rót
// ------------------------------------------------------------

/** Phương thức vận chuyển */
export enum TransportMode {
  TRUCK = 'TRUCK', // Ô tô
  VESSEL = 'VESSEL', // Tàu thủy
  CHUTE = 'CHUTE', // Băng tải / máng
}

/** Trạng thái lệnh nhập (ImportOrder) */
export enum OrderStatus {
  ISSUED = 'ISSUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ------------------------------------------------------------
// Ca làm việc (ShiftRecord)
// ------------------------------------------------------------

/** Mã ca */
export enum ShiftCode {
  CA1 = 'CA1',
  CA2 = 'CA2',
  CA3 = 'CA3',
}

/**
 * Trạng thái ca làm việc
 *
 * Vòng đời: NHAP_LIEU → CHO_PHOI_CAN → DA_CHOT_CA → SAU_DO (*) → DA_KHOA
 * (*) SAU_DO chỉ áp dụng cho ca có than NK (đo mớn tàu)
 *
 * Quan trọng với FE:
 *  - Chỉ DA_CHOT_CA trở lên mới được tính vào Thẻ kho & báo cáo N-X-T
 *  - DA_KHOA: disable toàn bộ form của ca đó
 */
export enum ShiftStatus {
  NHAP_LIEU = 'NHAP_LIEU', // Đang nhập, chưa phơi cân
  CHO_PHOI_CAN = 'CHO_PHOI_CAN', // Chờ kết quả đo ẩm cuối ca
  DA_CHOT_CA = 'DA_CHOT_CA', // Đã chốt, phiếu N-X đã sinh
  SAU_DO = 'SAU_DO', // Đã điều chỉnh sau đo mớn (chỉ NK)
  DA_KHOA = 'DA_KHOA', // Đã khóa bởi TK_KT – không sửa được
}

// ------------------------------------------------------------
// ImportTruckDetail (chuyến xe ô tô)
// ------------------------------------------------------------

/** Trạng thái từng chuyến xe */
export enum TruckStatus {
  NHAP_LIEU = 'NHAP_LIEU',
  CHO_PHOI_CAN = 'CHO_PHOI_CAN',
  DA_CHOT = 'DA_CHOT',
}

/**
 * Hình thức nhập ô tô
 * (Dự kiến là tập con của enum ImportExportMode khi enum đó được định nghĩa đầy đủ — xem TODO ở ImportExportDirection)
 */
export enum TruckImportMode {
  DO_KHO = 'DO_KHO', // Đổ kho (tích trữ bình thường)
  DO_THANG = 'DO_THANG', // Đổ thẳng (không qua kho)
  DO_THANG_KHO = 'DO_THANG_KHO', // Đổ thẳng có qua kho
}

// ------------------------------------------------------------
// TransferWarehouse (chuyển kho nội bộ)
// ------------------------------------------------------------

export enum TransferType {
  BANG_TAI = 'BANG_TAI', // Băng tải
  NK_NGOAI = 'NK_NGOAI', // NK ngoài (bên ngoài đổ vào)
}

// ------------------------------------------------------------
// BlendPlan (phương án pha trộn)
// ------------------------------------------------------------

export enum BlendPlanStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  EXECUTING = 'EXECUTING',
}

// ------------------------------------------------------------
// Chứng từ kho (WarehouseReceipt / WarehouseIssue)
// ------------------------------------------------------------

/**
 * Trạng thái chứng từ kho
 * Stepper ký duyệt: DRAFT → PENDING_KCS → PENDING_TK → PENDING_QD → APPROVED / REJECTED
 */
export enum DocStatus {
  DRAFT = 'DRAFT', // Nháp
  PENDING_KCS = 'PENDING_KCS', // Chờ KCS xác nhận
  PENDING_TK = 'PENDING_TK', // Chờ Thủ kho
  PENDING_QD = 'PENDING_QD', // Chờ Quản đốc
  APPROVED = 'APPROVED', // Đã duyệt hoàn tất
  REJECTED = 'REJECTED', // Từ chối
}

// ------------------------------------------------------------
// Kỳ kế toán (AccountingPeriod)
// ------------------------------------------------------------

/**
 * Trạng thái kỳ kế toán
 *
 * FE rules:
 *  - OPEN: form tạo/sửa chứng từ bình thường
 *  - UNIT_LOCKED: chỉ TK_KT / ADMIN được sửa
 *  - COMPANY_LOCKED: không ai sửa được nữa
 */
export enum PeriodStatus {
  OPEN = 'OPEN',
  UNIT_LOCKED = 'UNIT_LOCKED',
  COMPANY_LOCKED = 'COMPANY_LOCKED',
}

// ------------------------------------------------------------
// ImportNkVessel (than NK đo mớn tàu)
// ------------------------------------------------------------

// isPostMeasure: boolean – không cần enum riêng, dùng boolean trực tiếp

// ------------------------------------------------------------
// Audit log
// ------------------------------------------------------------

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  LOCK = 'LOCK',
  CLOSE = 'CLOSE',
  POST_MEASURE = 'POST_MEASURE',
}

// ------------------------------------------------------------
// API Error codes
// ------------------------------------------------------------

export enum ApiErrorCode {
  UNAUTHORIZED = 'ERR_UNAUTHORIZED',
  FORBIDDEN = 'ERR_FORBIDDEN',
  NOT_FOUND = 'ERR_NOT_FOUND',
  VALIDATION = 'ERR_VALIDATION',
  PERIOD_CLOSED = 'ERR_PERIOD_CLOSED',
  SHIFT_LOCKED = 'ERR_SHIFT_LOCKED',
  EXCEED_PLAN = 'ERR_EXCEED_PLAN',
  NEGATIVE_STOCK = 'ERR_NEGATIVE_STOCK',
  OVER_LOSS_LIMIT = 'ERR_OVER_LOSS_LIMIT',
  OPTIMISTIC_LOCK = 'ERR_OPTIMISTIC_LOCK',
  DUPLICATE = 'ERR_DUPLICATE',
  BLEND_NOT_APPROVED = 'ERR_BLEND_NOT_APPROVED',
  SHIFT_NOT_CLOSED = 'ERR_SHIFT_NOT_CLOSED',
}
