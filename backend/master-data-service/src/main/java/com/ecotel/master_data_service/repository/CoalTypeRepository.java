package com.ecotel.master_data_service.repository;

import com.ecotel.master_data_service.entity.CoalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoalTypeRepository extends JpaRepository<CoalType, Long> {
    List<CoalType> findByActiveTrue();

    boolean existsByCode(@NotBlank @Size(max = 50) String code);
}
