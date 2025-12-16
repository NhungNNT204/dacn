package com.upnest.edu.modules.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.upnest.edu.modules.user.payload.AuthResponse;
import com.upnest.edu.modules.user.payload.LoginRequest;
import com.upnest.edu.modules.user.payload.RegisterRequest;
import com.upnest.edu.modules.user.service.AuthenticationService;

import lombok.extern.slf4j.Slf4j;

/**
 * Controller: UserAuthController
 * REST API endpoints cho xác thực (đăng ký, đăng nhập) - User Management Module
 * 
 * Endpoints:
 * - POST /api/auth/register - Đăng ký
 * - POST /api/auth/login - Đăng nhập
 * 
 * [DISABLED] - Duplicate with AuthController in auth module
 */

@Slf4j
// @RestController - DISABLED: Conflict with AuthController
@RequestMapping("/api/v1/auth")
public class UserAuthController {
    
    private final AuthenticationService authenticationService;
    
    public UserAuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }
    
    /**
     * Đăng ký tài khoản mới
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("Register request for username: {}", request.getUsername());
        
        try {
            AuthResponse response = authenticationService.register(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    
    /**
     * Đăng nhập
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("Login request for username: {}", request.getUsername());
        
        try {
            AuthResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    
    /**
     * Kiểm tra xem username đã tồn tại chưa
     * GET /api/auth/check-username?username=abc
     */
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Object>> checkUsername(@RequestParam String username) {
        // Thực hiện check trong service
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("available", true); // Thay đổi logic check
        return ResponseEntity.ok(response);
    }
    
    /**
     * Kiểm tra xem email đã tồn tại chưa
     * GET /api/auth/check-email?email=test@example.com
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("available", true); // Thay đổi logic check
        return ResponseEntity.ok(response);
    }
}
