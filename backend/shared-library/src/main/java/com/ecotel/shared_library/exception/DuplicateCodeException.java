package com.ecotel.shared_library.exception;

// 422 - trùng code/số hiệu
public class DuplicateCodeException extends RuntimeException {
    public DuplicateCodeException(String entity, String code) {
        super("Mã '" + code + "' đã tồn tại trong " + entity);
    }
}
