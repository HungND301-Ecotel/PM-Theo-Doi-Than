package com.ecotel.master_data_service.entity;

import com.ecotel.master_data_service.enums.WarehouseType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "warehouse")
@SequenceGenerator(
        name = "entity_seq",
        sequenceName = "warehouse_seq",
        allocationSize = 50
)
@Getter
@Setter
public class Warehouse extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "warehouse_type", nullable = false, length = 30)
    private WarehouseType warehouseType;

    @Column(name = "parent_cluster", length = 100)
    private String parentCluster; // Ví dụ: "Cụm Kho cảng G9 - Hóa Chất" — null nếu DIRECT_DELIVERY

    @Column(name = "design_capacity_ton", precision = 14, scale = 2)
    private BigDecimal designCapacityTon; // Chỉ áp dụng khi warehouseType = KHO

    @Column(name = "allow_direct_transfer", nullable = false)
    private boolean allowDirectTransfer = false;

    @Column(name = "manager_user_id")
    private Long managerUserId; // Tham chiếu user từ Portal, không FK cứng

    @Column(name = "location_note", length = 255)
    private String locationNote;
}

