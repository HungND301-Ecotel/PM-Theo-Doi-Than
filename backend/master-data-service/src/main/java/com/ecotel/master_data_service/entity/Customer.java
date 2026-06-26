package com.ecotel.master_data_service.entity;

import com.ecotel.master_data_service.enums.CustomerType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customer")
@SequenceGenerator(
        name = "entity_seq",
        sequenceName = "customer_seq",
        allocationSize = 50
)
@Getter
@Setter
public class Customer extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type", nullable = false, length = 30)
    private CustomerType customerType;

    @Column(name = "tax_code", length = 20)
    private String taxCode;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;
}

