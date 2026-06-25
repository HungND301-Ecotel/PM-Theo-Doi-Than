package com.ecotel.master_data_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "coal_type")
@SequenceGenerator(
        name = "entity_seq",
        sequenceName = "coal_type_seq",
        allocationSize = 50
)
@Getter
@Setter
public class CoalType extends BaseEntity {

    @Column(name = "ref_heating_value_kcal", precision = 10, scale = 2)
    private BigDecimal refHeatingValueKcal; // Nhiệt năng tham chiếu (Kcal/kg)

    @Column(name = "standard_moisture_pct", precision = 5, scale = 2)
    private BigDecimal standardMoisturePct; // Wtc mặc định — có thể override theo hợp đồng tại batch_sheet

    @Column(name = "description", length = 500)
    private String description;
}

