package com.example.demo.application.dto;

import lombok.Data;

@Data
public class TokenResponseDto {
    private String accessToken;
    private String tokenType;
    private Long expiresIn;
}