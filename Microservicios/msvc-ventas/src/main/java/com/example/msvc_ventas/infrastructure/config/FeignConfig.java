package com.example.msvc_ventas.infrastructure.config;

import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            // Personaliza el manejo de errores aquí si es necesario
            return feign.FeignException.errorStatus(methodKey, response);
        };
    }
}