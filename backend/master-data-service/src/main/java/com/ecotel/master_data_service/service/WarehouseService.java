package com.ecotel.master_data_service.service;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.WarehouseRequest;
import com.ecotel.master_data_service.dto.response.WarehouseResponse;
import com.ecotel.master_data_service.entity.CoalType;
import com.ecotel.master_data_service.entity.Warehouse;
import com.ecotel.master_data_service.enums.WarehouseType;
import com.ecotel.master_data_service.mapper.WarehouseMapper;
import com.ecotel.master_data_service.repository.WarehouseRepository;
import com.ecotel.shared_library.exception.BusinessValidationException;
import com.ecotel.shared_library.exception.DuplicateCodeException;
import com.ecotel.shared_library.exception.EmptyListException;
import com.ecotel.shared_library.exception.ResourceNotFoundException;
import com.ecotel.shared_library.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final CommonService commonService;

    public Page<WarehouseResponse> findAll(Pageable pageable) {
        return warehouseRepository.findAll(pageable)
                .map(warehouseMapper::toResponse);
    }

    public List<LookupResponse> findAllForLookup() {
        return warehouseRepository.findByActiveTrue()
                .stream()
                .map(warehouseMapper::toLookup)
                .toList();
    }

    public WarehouseResponse findById(Long id) {
        return warehouseMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public WarehouseResponse create(WarehouseRequest request) {
        if (warehouseRepository.existsByCode(request.code())) {
            throw new DuplicateCodeException("warehouse", request.code());
        }
        validateWarehouseRequest(request);
        return warehouseMapper.toResponse(
                warehouseRepository.save(warehouseMapper.toEntity(request))
        );
    }

    @Transactional
    public List<WarehouseResponse> createBulk(List<WarehouseRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new EmptyListException("Danh sách không được để trống");
        }

        requests.forEach(this::validateWarehouseRequest);

        List<Warehouse> entities = warehouseMapper.toEntityList(requests);
        return warehouseMapper.toResponseList(warehouseRepository.saveAll(entities));
    }

    @Transactional
    public WarehouseResponse update(WarehouseRequest request) {
        Warehouse entity = getOrThrow(request.id());
        if (!entity.getCode().equals(request.code())
                && warehouseRepository.existsByCode(request.code())) {
            throw new DuplicateCodeException("warehouse", request.code());
        }
        validateWarehouseRequest(request);
        warehouseMapper.updateEntityFromRequest(request, entity);
        return warehouseMapper.toResponse(entity);
    }

    @Transactional
    public List<WarehouseResponse> updateBulk(List<WarehouseRequest> requests){
        Map<Long, Warehouse> warehouseMap = commonService.fetchEntityMap(
                requests,
                WarehouseRequest::id,
                warehouseRepository::findAllById,
                Warehouse::getId
        );

        requests.forEach(this::validateWarehouseRequest);


        List<Warehouse> entities = requests.stream()
                .map(request -> {
                    Warehouse entity = warehouseMap.get(request.id());
                    warehouseMapper.updateEntityFromRequest(request, entity);
                    return entity;
                }).toList();

        return warehouseMapper.toResponseList(warehouseRepository.saveAll(entities));
    }

    @Transactional
    public void setActive(Long id, boolean active) {
        getOrThrow(id).setActive(active);
    }

    @Transactional
    public void deleteBulk(List<Long> ids) {
        List<Warehouse> entities = warehouseRepository.findAllById(ids);
        entities.forEach(e -> e.setActive(false));
        warehouseRepository.saveAll(entities);
    }

    private void validateWarehouseRequest(WarehouseRequest request) {
        if (request.warehouseType() == WarehouseType.KHO
                && request.designCapacityTon() == null) {
            throw new BusinessValidationException(
                    "design_capacity_ton là bắt buộc khi warehouseType = KHO");
        }
    }

    private Warehouse getOrThrow(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", id));
    }
}
