package com.ecotel.master_data_service.service;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.CoalTypeRequest;
import com.ecotel.master_data_service.dto.response.CoalTypeResponse;
import com.ecotel.master_data_service.entity.CoalType;
import com.ecotel.master_data_service.mapper.CoalTypeMapper;
import com.ecotel.master_data_service.repository.CoalTypeRepository;
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
public class CoalTypeService {

    private final CoalTypeRepository coalTypeRepository;
    private final CoalTypeMapper coalTypeMapper;
    private final CommonService commonService;

    public Page<CoalTypeResponse> findAll(Pageable pageable) {
        return coalTypeRepository.findAll(pageable)
                .map(coalTypeMapper::toResponse);
    }

    public List<LookupResponse> findAllForLookup() {
        return coalTypeRepository.findByActiveTrue()
                .stream()
                .map(coalTypeMapper::toLookup)
                .toList();
    }

    public CoalTypeResponse findById(Long id) {
        return coalTypeMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public CoalTypeResponse create(CoalTypeRequest request) {
        if (coalTypeRepository.existsByCode(request.code())) {
            throw new DuplicateCodeException("coal_type", request.code());
        }
        return coalTypeMapper.toResponse(
                coalTypeRepository.save(coalTypeMapper.toEntity(request))
        );
    }

    @Transactional
    public List<CoalTypeResponse> createBulk(List<CoalTypeRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new EmptyListException("Danh sách không được để trống");
        }

        List<CoalType> entities = coalTypeMapper.toEntityList(requests);
        return coalTypeMapper.toResponseList(coalTypeRepository.saveAll(entities));
    }

    @Transactional
    public CoalTypeResponse update(CoalTypeRequest request) {
        CoalType entity = getOrThrow(request.id());
        if (!entity.getCode().equals(request.code())
                && coalTypeRepository.existsByCode(request.code())) {
            throw new DuplicateCodeException("coal_type", request.code());
        }
        coalTypeMapper.updateEntityFromRequest(request, entity);
        return coalTypeMapper.toResponse(entity); // entity đã được manage bởi JPA, auto flush
    }

    @Transactional
    public List<CoalTypeResponse> updateBulk(List<CoalTypeRequest> requests){
        Map<Long, CoalType> coalTypeMap = commonService.fetchEntityMap(
                requests,
                CoalTypeRequest::id,
                coalTypeRepository::findAllById,
                CoalType::getId
        );

        List<CoalType> entities = requests.stream()
                .map(request -> {
                    CoalType entity = coalTypeMap.get(request.id());
                    coalTypeMapper.updateEntityFromRequest(request, entity);
                    return entity;
                }).toList();

        return coalTypeMapper.toResponseList(coalTypeRepository.saveAll(entities));
    }

    @Transactional
    public void setActive(Long id, boolean active) {
        CoalType entity = getOrThrow(id);
        entity.setActive(active);
    }

    @Transactional
    public void deleteBulk(List<Long> ids) {
        List<CoalType> entities = coalTypeRepository.findAllById(ids);
        entities.forEach(e -> e.setActive(false));
        coalTypeRepository.saveAll(entities);
    }

    private CoalType getOrThrow(Long id) {
        return coalTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CoalType", id));
    }
}
