package com.ecotel.master_data_service.mapper;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.CoalTypeRequest;
import com.ecotel.master_data_service.dto.response.CoalTypeResponse;
import com.ecotel.master_data_service.entity.CoalType;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CoalTypeMapper {

    CoalType toEntity(CoalTypeRequest request);

    CoalTypeResponse toResponse(CoalType entity);

    LookupResponse toLookup(CoalType entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(CoalTypeRequest request, @MappingTarget CoalType entity);

    List<CoalType> toEntityList(List<CoalTypeRequest> requests);
    List<CoalTypeResponse> toResponseList(List<CoalType> entities);
}
