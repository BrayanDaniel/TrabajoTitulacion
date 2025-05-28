package com.example.msvc_producto.infrastructure.config;

import feign.codec.ErrorDecoder;
import feign.FeignException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            // Personaliza manejo de errores aquí si es necesario
            return FeignException.errorStatus(methodKey, response);
        };
    }
}