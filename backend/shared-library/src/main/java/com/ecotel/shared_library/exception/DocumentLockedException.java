package com.ecotel.shared_library.exception;

// 409 - chứng từ đã có chữ ký, không cho sửa trường nghiệp vụ
public class DocumentLockedException extends RuntimeException {
  public DocumentLockedException(String documentNo) {
    super("Chứng từ " + documentNo + " đã có chữ ký, không thể chỉnh sửa");
  }
}
