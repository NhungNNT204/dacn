package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO: LoginRequest
 * Request cho API đăng nhập
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    /**
     * Username hoặc email
     */
    @JsonProperty("username")
    private String username;
    
    /**
     * Mật khẩu
     */
    @JsonProperty("password")
    private String password;
}
