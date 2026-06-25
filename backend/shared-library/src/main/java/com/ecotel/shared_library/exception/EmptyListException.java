package com.ecotel.shared_library.exception;

// 409 - đã ký bước này rồi
public class EmptyListException extends RuntimeException {
    public EmptyListException(String role) {
        super("Danh sách không được để trống");
    }
}
