package com.ecotel.master_data_service.config;

import com.ecotel.shared_library.config.JwtConverterConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final String[] PUBLIC_ENDPOINT = {
            "/actuator/health",
            "/v3/api-docs/**",
            "/swagger-ui/**"
    };

    private final JwtConverterConfig jwtConverter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers(PUBLIC_ENDPOINT).permitAll()
//                        .anyRequest().authenticated()
                                .anyRequest().permitAll() // test
                )
//                .oauth2ResourceServer(oauth2 -> oauth2
//                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
//                )
                .httpBasic(AbstractHttpConfigurer::disable) // Tat Login Swagger
                .formLogin(AbstractHttpConfigurer::disable)
                .build();
    }
}
