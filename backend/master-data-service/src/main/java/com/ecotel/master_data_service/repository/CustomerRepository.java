package com.ecotel.master_data_service.repository;

import com.ecotel.master_data_service.entity.Customer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByCode(@NotBlank @Size(max = 50) String code);

    List<Customer> findByActiveTrue();
}
