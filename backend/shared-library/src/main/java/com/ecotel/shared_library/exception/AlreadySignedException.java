package com.ecotel.shared_library.exception;

// 409 - đã ký bước này rồi
public class AlreadySignedException extends RuntimeException {
    public AlreadySignedException(String role) {
        super("Vai trò " + role + " đã ký chứng từ này");
    }
}
