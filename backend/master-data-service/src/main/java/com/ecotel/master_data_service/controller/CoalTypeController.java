package com.ecotel.master_data_service.controller;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.CoalTypeRequest;
import com.ecotel.master_data_service.dto.response.CoalTypeResponse;
import com.ecotel.master_data_service.service.CoalTypeService;
import com.ecotel.shared_library.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coal-types")
@RequiredArgsConstructor
public class CoalTypeController {

    private final CoalTypeService coalTypeService;

    @GetMapping
    public ApiResponse<Page<CoalTypeResponse>> findAll(Pageable pageable) {
        return ApiResponse.ok(coalTypeService.findAll(pageable));
    }

    @GetMapping("/lookup")
    public ApiResponse<List<LookupResponse>> findAllForLookup() {
        return ApiResponse.ok(coalTypeService.findAllForLookup());
    }

    @GetMapping("/{id}")
    public ApiResponse<CoalTypeResponse> findById(@PathVariable Long id) {
        return ApiResponse.ok(coalTypeService.findById(id));
    }

    @PostMapping
    public ApiResponse<CoalTypeResponse> create(@RequestBody @Valid CoalTypeRequest request) {
        return ApiResponse.ok(coalTypeService.create(request));
    }

    @PostMapping("/bulk")
    public ApiResponse<List<CoalTypeResponse>> createBulk(
            @RequestBody @Valid List<CoalTypeRequest> requests) {
        return ApiResponse.ok(coalTypeService.createBulk(requests));
    }

    @PutMapping("/{id}")
    public ApiResponse<CoalTypeResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid CoalTypeRequest request) {
        return ApiResponse.ok(coalTypeService.update(request));
    }

    @PutMapping("/bulk")
    public ApiResponse<List<CoalTypeResponse>> updateBulk(
            @RequestBody @Valid List<CoalTypeRequest> requests) {
        return ApiResponse.ok(coalTypeService.updateBulk(requests));
    }

    @PatchMapping("/{id}/active")
    public ApiResponse<Void> setActive(@PathVariable Long id, @RequestParam boolean active) {
        coalTypeService.setActive(id, active);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/bulk")
    public ApiResponse<Void> deleteBulk(@RequestBody List<Long> ids) {
        coalTypeService.deleteBulk(ids);
        return ApiResponse.ok(null);
    }
}
