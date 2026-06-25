package com.ecotel.shared_library.exception;

// 409 - ký không đúng thứ tự
public class SignatureOutOfSequenceException extends RuntimeException {
    public SignatureOutOfSequenceException(String expectedRole) {
        super("Chưa đến lượt ký — bước hiện tại cần: " + expectedRole);
    }
}
