package com.ecotel.shared_library.exception;

// 422 - vi phạm rule nghiệp vụ chung
public class BusinessValidationException extends RuntimeException {
    public BusinessValidationException(String message) {
        super(message);
    }
}
