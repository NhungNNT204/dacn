package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO: AuthResponse
 * Response sau khi đăng nhập/đăng ký thành công
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("role")
    private String role;
    
    /**
     * JWT Access Token
     */
    @JsonProperty("accessToken")
    private String accessToken;
    
    /**
     * Refresh Token
     */
    @JsonProperty("refreshToken")
    private String refreshToken;
    
    /**
     * Token type (Bearer)
     */
    @Builder.Default
    @JsonProperty("tokenType")
    private String tokenType = "Bearer";
}
