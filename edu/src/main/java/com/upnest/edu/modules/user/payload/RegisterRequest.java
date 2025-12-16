package com.upnest.edu.modules.user.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO: RegisterRequest
 * Request cho API đăng ký
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    /**
     * Tên đăng nhập (bắt buộc)
     */
    @JsonProperty("username")
    private String username;
    
    /**
     * Email (bắt buộc)
     */
    @JsonProperty("email")
    private String email;
    
    /**
     * Mật khẩu (bắt buộc, tối thiểu 6 ký tự)
     */
    @JsonProperty("password")
    private String password;
    
    /**
     * Xác nhận mật khẩu
     */
    @JsonProperty("confirmPassword")
    private String confirmPassword;
    
    /**
     * Họ tên đầy đủ
     */
    @JsonProperty("fullName")
    private String fullName;
    
    /**
     * Vai trò: STUDENT, TEACHER
     */
    @JsonProperty("role")
    private String role = "STUDENT";
}
