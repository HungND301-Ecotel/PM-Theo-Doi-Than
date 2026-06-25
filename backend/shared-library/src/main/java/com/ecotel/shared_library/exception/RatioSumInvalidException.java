package com.ecotel.shared_library.exception;

import java.math.BigDecimal;

// 422 - tổng tỷ lệ pha trộn != 100% (dùng ở order-service)
public class RatioSumInvalidException extends RuntimeException {
    public RatioSumInvalidException(BigDecimal actual) {
        super("Tổng tỷ lệ % thành phần pha trộn phải bằng 100%, hiện tại: " + actual);
    }
}
