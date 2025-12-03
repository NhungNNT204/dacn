package com.upnest.edu.modules.auth.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.upnest.edu.modules.auth.entity.Role;

public class AuthResponse {
    private String token;
    private String fullName;
    private String email;
    private Role role;
    
    // Trường này dùng để báo cho Frontend biết có cần nhập mã OTP hay không
    @JsonProperty("is2faRequired")
    private boolean is2faRequired;

    // --- CONSTRUCTORS ---
    public AuthResponse() {}

    public AuthResponse(String token, String fullName, String email, Role role, boolean is2faRequired) {
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.is2faRequired = is2faRequired;
    }

    // --- GETTERS & SETTERS ---
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean is2faRequired() { // Getter chuẩn cho boolean thường là is...
        return is2faRequired;
    }

    public void set2faRequired(boolean is2faRequired) {
        this.is2faRequired = is2faRequired;
    }
}