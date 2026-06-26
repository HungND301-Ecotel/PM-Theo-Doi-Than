package com.ecotel.master_data_service.repository;

import com.ecotel.master_data_service.entity.Warehouse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    boolean existsByCode(@NotBlank @Size(max = 50) String code);

    List<Warehouse> findByActiveTrue();
}
