import type { Role } from '../constants/enums';

// ------------------------------------------------------------
// API response wrapper
// ------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  /** Chỉ có khi code = ERR_VALIDATION */
  fieldErrors?: Record<string, string>;
}

// ------------------------------------------------------------
// Pagination
// ------------------------------------------------------------

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string; // vd: 'createdAt,desc'
}

// ------------------------------------------------------------
// Auth / JWT
// ------------------------------------------------------------

export interface JwtPayload {
  sub: string; // user UUID
  username: string;
  roles: Role[];
  warehouseIds: string[]; // UUID[] — kho được phép (TK_DV bị giới hạn)
  iat: number;
  exp: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // giây
}

// ------------------------------------------------------------
// Common field patterns
// ------------------------------------------------------------

/** Mọi entity đều có id, version (optimistic lock), createdAt, updatedAt */
export interface BaseEntity {
  id: string;
  version: number;
  createdAt: string; // ISO 8601
  updatedAt: string;
  createdBy?: string; // user UUID
}

/** Trường active dùng cho Master data */
export interface Activatable {
  active: boolean;
}
