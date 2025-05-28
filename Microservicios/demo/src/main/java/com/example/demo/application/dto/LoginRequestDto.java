package com.example.demo.application.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
}