package com.ecotel.shared_library.exception;

// 422 - chứng thư KCS chưa có khi tính quy ẩm (dùng ở lot-reconciliation-service)
public class CertificateRequiredException extends RuntimeException {
    public CertificateRequiredException(Long batchSheetId) {
        super("Chưa có chứng thư KCS cho bảng kê id: " + batchSheetId);
    }
}
