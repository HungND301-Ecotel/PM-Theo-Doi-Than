package com.ecotel.master_data_service.controller;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.CustomerRequest;
import com.ecotel.master_data_service.dto.response.CustomerResponse;
import com.ecotel.master_data_service.service.CustomerService;
import com.ecotel.shared_library.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ApiResponse<Page<CustomerResponse>> findAll(Pageable pageable) {
        return ApiResponse.ok(customerService.findAll(pageable));
    }

    @GetMapping("/lookup")
    public ApiResponse<List<LookupResponse>> findAllForLookup() {
        return ApiResponse.ok(customerService.findAllForLookup());
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> findById(@PathVariable Long id) {
        return ApiResponse.ok(customerService.findById(id));
    }

    @PostMapping
    public ApiResponse<CustomerResponse> create(@RequestBody @Valid CustomerRequest request) {
        return ApiResponse.ok(customerService.create(request));
    }

    @PostMapping("/bulk")
    public ApiResponse<List<CustomerResponse>> createBulk(
            @RequestBody @Valid List<CustomerRequest> requests) {
        return ApiResponse.ok(customerService.createBulk(requests));
    }

    @PutMapping("/{id}")
    public ApiResponse<CustomerResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid CustomerRequest request) {
        return ApiResponse.ok(customerService.update(request));
    }

    @PutMapping("/bulk")
    public ApiResponse<List<CustomerResponse>> updateBulk(
            @RequestBody @Valid List<CustomerRequest> requests) {
        return ApiResponse.ok(customerService.updateBulk(requests));
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<Void> setActive(@PathVariable Long id, @RequestParam boolean active) {
        customerService.setActive(id, active);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/bulk")
    public ApiResponse<Void> deleteBulk(@RequestBody List<Long> ids) {
        customerService.deleteBulk(ids);
        return ApiResponse.ok(null);
    }
}
