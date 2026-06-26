package com.ecotel.master_data_service.service;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.CustomerRequest;
import com.ecotel.master_data_service.dto.response.CustomerResponse;
import com.ecotel.master_data_service.entity.Customer;
import com.ecotel.master_data_service.mapper.CustomerMapper;
import com.ecotel.master_data_service.repository.CustomerRepository;
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
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final CommonService commonService;

    public Page<CustomerResponse> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(customerMapper::toResponse);
    }

    public List<LookupResponse> findAllForLookup() {
        return customerRepository.findByActiveTrue()
                .stream()
                .map(customerMapper::toLookup)
                .toList();
    }

    public CustomerResponse findById(Long id) {
        return customerMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByCode(request.code())) {
            throw new DuplicateCodeException("coal_type", request.code());
        }
        return customerMapper.toResponse(
                customerRepository.save(customerMapper.toEntity(request))
        );
    }

    @Transactional
    public List<CustomerResponse> createBulk(List<CustomerRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new EmptyListException("Danh sách không được để trống");
        }

        List<Customer> entities = customerMapper.toEntityList(requests);
        return customerMapper.toResponseList(customerRepository.saveAll(entities));
    }

    @Transactional
    public CustomerResponse update(CustomerRequest request) {
        Customer entity = getOrThrow(request.id());
        if (!entity.getCode().equals(request.code())
                && customerRepository.existsByCode(request.code())) {
            throw new DuplicateCodeException("coal_type", request.code());
        }
        customerMapper.updateEntityFromRequest(request, entity);
        return customerMapper.toResponse(entity); // entity đã được manage bởi JPA, auto flush
    }

    @Transactional
    public List<CustomerResponse> updateBulk(List<CustomerRequest> requests){
        Map<Long, Customer> customerMap = commonService.fetchEntityMap(
                requests,
                CustomerRequest::id,
                customerRepository::findAllById,
                Customer::getId
        );

        List<Customer> entities = requests.stream()
                .map(request -> {
                    Customer entity = customerMap.get(request.id());
                    customerMapper.updateEntityFromRequest(request, entity);
                    return entity;
                }).toList();

        return customerMapper.toResponseList(customerRepository.saveAll(entities));
    }

    @Transactional
    public void setActive(Long id, boolean active) {
        Customer entity = getOrThrow(id);
        entity.setActive(active);
    }

    @Transactional
    public void deleteBulk(List<Long> ids) {
        List<Customer> entities = customerRepository.findAllById(ids);
        entities.forEach(e -> e.setActive(false));
        customerRepository.saveAll(entities);
    }

    private Customer getOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }
}
