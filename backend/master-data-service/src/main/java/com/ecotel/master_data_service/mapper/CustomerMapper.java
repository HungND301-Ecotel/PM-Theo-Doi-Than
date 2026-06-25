package com.ecotel.master_data_service.mapper;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.CoalTypeRequest;
import com.ecotel.master_data_service.dto.request.CustomerRequest;
import com.ecotel.master_data_service.dto.response.CoalTypeResponse;
import com.ecotel.master_data_service.dto.response.CustomerResponse;
import com.ecotel.master_data_service.entity.CoalType;
import com.ecotel.master_data_service.entity.Customer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    Customer toEntity(CustomerRequest request);

    CustomerResponse toResponse(Customer entity);

    LookupResponse toLookup(Customer entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(CustomerRequest request, @MappingTarget Customer entity);

    List<Customer> toEntityList(List<CustomerRequest> requests);
    List<CustomerResponse> toResponseList(List<Customer> entities);
}
