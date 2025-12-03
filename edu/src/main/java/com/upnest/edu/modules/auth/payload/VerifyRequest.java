package com.upnest.edu.modules.auth.payload;

public class VerifyRequest {
    private String email;
    private Integer code; // Mã 6 số xác thực 2FA

    // Default constructor
    public VerifyRequest() {}

    public VerifyRequest(String email, Integer code) {
        this.email = email;
        this.code = code;
    }

    // --- GETTERS & SETTERS (Thủ công) ---

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}