package com.ecotel.shared_library.exception;

import java.math.BigDecimal;

// 422 - tồn kho không đủ (dùng ở warehouse-transaction-service)
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String warehouseName, String coalTypeName,
                                      BigDecimal available, BigDecimal requested) {
        super("Số lượng xuất (" + requested + ") vượt tồn kho khả dụng ("
                + available + ") tại " + warehouseName + " / " + coalTypeName);
    }
}
