package com.ecotel.master_data_service.dto.response;

import com.ecotel.master_data_service.enums.WarehouseType;

import java.math.BigDecimal;
import java.time.Instant;

public record WarehouseResponse(
        Long id,
        String code,
        String name,
        WarehouseType warehouseType,
        String parentCluster,
        BigDecimal designCapacityTon,
        Boolean allowDirectTransfer,
        Long managerUserId,
        String locationNote,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
