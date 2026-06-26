package com.ecotel.master_data_service.dto.response;

import com.ecotel.master_data_service.enums.CustomerType;

import java.time.Instant;

public record CustomerResponse(
        Long id,
        String code,
        String name,
        CustomerType customerType,
        String taxCode,
        String address,
        String contactPhone,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
