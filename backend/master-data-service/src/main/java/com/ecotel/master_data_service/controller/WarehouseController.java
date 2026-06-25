package com.ecotel.master_data_service.controller;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.WarehouseRequest;
import com.ecotel.master_data_service.dto.response.WarehouseResponse;
import com.ecotel.master_data_service.service.WarehouseService;
import com.ecotel.shared_library.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public ApiResponse<Page<WarehouseResponse>> findAll(Pageable pageable) {
        return ApiResponse.ok(warehouseService.findAll(pageable));
    }

    @GetMapping("/lookup")
    public ApiResponse<List<LookupResponse>> findAllForLookup() {
        return ApiResponse.ok(warehouseService.findAllForLookup());
    }

    @GetMapping("/{id}")
    public ApiResponse<WarehouseResponse> findById(@PathVariable Long id) {
        return ApiResponse.ok(warehouseService.findById(id));
    }

    @PostMapping
    public ApiResponse<WarehouseResponse> create(@RequestBody @Valid WarehouseRequest request) {
        return ApiResponse.ok(warehouseService.create(request));
    }

    @PostMapping("/bulk")
    public ApiResponse<List<WarehouseResponse>> createBulk(
            @RequestBody @Valid List<WarehouseRequest> requests) {
        return ApiResponse.ok(warehouseService.createBulk(requests));
    }

    @PutMapping("/{id}")
    public ApiResponse<WarehouseResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid WarehouseRequest request) {
        return ApiResponse.ok(warehouseService.update(request));
    }

    @PutMapping("/bulk")
    public ApiResponse<List<WarehouseResponse>> updateBulk(
            @RequestBody @Valid List<WarehouseRequest> requests) {
        return ApiResponse.ok(warehouseService.updateBulk(requests));
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<Void> setActive(@PathVariable Long id, @RequestParam boolean active) {
        warehouseService.setActive(id, active);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/bulk")
    public ApiResponse<Void> deleteBulk(@RequestBody List<Long> ids) {
        warehouseService.deleteBulk(ids);
        return ApiResponse.ok(null);
    }
}
