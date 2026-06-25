package com.ecotel.master_data_service.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record CoalTypeResponse(
        Long id,
        String code,
        String name,
        String description,
        BigDecimal refHeatingValueKcal,
        BigDecimal standardMoisturePct,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
