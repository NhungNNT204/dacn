package com.upnest.edu.modules.auth.payload;

public class LoginRequest {
    private String email;
    private String password;

    // Default constructor (Cần thiết cho Jackson để parse JSON)
    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // --- GETTERS & SETTERS (Thủ công) ---
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}