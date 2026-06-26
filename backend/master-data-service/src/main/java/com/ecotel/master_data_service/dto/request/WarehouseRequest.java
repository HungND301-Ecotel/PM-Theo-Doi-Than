package com.ecotel.master_data_service.dto.request;

import com.ecotel.master_data_service.enums.WarehouseType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record WarehouseRequest(
        Long id,
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 255) String name,
        @NotNull WarehouseType warehouseType,
        @Size(max = 100) String parentCluster,
        @Digits(integer = 12, fraction = 2) @DecimalMin(value = "0.00") BigDecimal designCapacityTon,
        Boolean allowDirectTransfer,
        Long managerUserId,
        @Size(max = 255) String locationNote
) {}
