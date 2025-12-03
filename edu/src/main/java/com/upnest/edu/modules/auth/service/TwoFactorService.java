package com.upnest.edu.modules.auth.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.stereotype.Service;

@Service
public class TwoFactorService {
    
    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();

    // 1. Tạo khóa bí mật mới (khi user muốn bật 2FA)
    public String generateNewSecret() {
        final GoogleAuthenticatorKey key = gAuth.createCredentials();
        return key.getKey();
    }

    // 2. Kiểm tra mã 6 số user gửi lên có khớp với Secret không
    public boolean isOtpValid(String secret, int code) {
        return gAuth.authorize(secret, code);
    }
}