package com.ecotel.master_data_service.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CoalTypeRequest(
        Long id,
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 255) String name,
        @Size(max = 500) String description,
        @Digits(integer = 8, fraction = 2) BigDecimal refHeatingValueKcal,
        @Digits(integer = 3, fraction = 2) BigDecimal standardMoisturePct
) {}
