package com.ecotel.shared_library;

import com.ecotel.shared_library.config.JwtConverterConfig;
import com.ecotel.shared_library.exception.GlobalExceptionHandler;
import com.ecotel.shared_library.service.CommonService;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({
        JwtConverterConfig.class,
        CommonService.class,
        GlobalExceptionHandler.class
})
public class SharedLibraryAutoConfiguration {}
