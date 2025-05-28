package com.example.demo.application.service;

import com.example.demo.application.dto.LoginRequestDto;
import com.example.demo.application.dto.TokenResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtEncoder jwtEncoder;
    private final UserDetailsService userDetailsService;

    public TokenResponseDto login(LoginRequestDto loginRequest) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        return generateToken(authentication);
    }

    private TokenResponseDto generateToken(Authentication authentication) {
        Instant now = Instant.now();
        long expiresIn = 3600; // 1 hora

        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(expiresIn, ChronoUnit.SECONDS))
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        TokenResponseDto tokenResponse = new TokenResponseDto();
        tokenResponse.setAccessToken(token);
        tokenResponse.setTokenType("Bearer");
        tokenResponse.setExpiresIn(expiresIn);

        return tokenResponse;
    }
}