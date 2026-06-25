package com.ecotel.master_data_service.mapper;

import com.ecotel.master_data_service.dto.lookup.LookupResponse;
import com.ecotel.master_data_service.dto.request.WarehouseRequest;
import com.ecotel.master_data_service.dto.response.WarehouseResponse;
import com.ecotel.master_data_service.entity.Warehouse;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarehouseMapper {

    Warehouse toEntity(WarehouseRequest request);

    WarehouseResponse toResponse(Warehouse entity);

    LookupResponse toLookup(Warehouse entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(WarehouseRequest request, @MappingTarget Warehouse entity);

    List<Warehouse> toEntityList(List<WarehouseRequest> requests);
    List<WarehouseResponse> toResponseList(List<Warehouse> entities);
}
