package com.ecotel.master_data_service.dto.request;

import com.ecotel.master_data_service.enums.CustomerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        Long id,
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 255) String name,
        @NotNull CustomerType customerType,
        @Size(max = 25) String taxCode,
        @Size(max = 500) String address,
        @Size(max = 255) String contactPhone
) {}
