package com.upnest.edu.modules.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upnest.edu.modules.auth.payload.AuthResponse;
import com.upnest.edu.modules.auth.payload.LoginRequest;
import com.upnest.edu.modules.auth.payload.VerifyRequest;
import com.upnest.edu.modules.user.repository.UserRepository;
import com.upnest.edu.modules.auth.service.TwoFactorService;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.service.JwtService;

// [FIX] Thêm @CrossOrigin để giải quyết lỗi 403 Forbidden từ trình duyệt
@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TwoFactorService twoFactorService;

    // [FIX LỖI] Constructor thủ công thay vì dùng @RequiredArgsConstructor của Lombok
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          JwtService jwtService,
                          TwoFactorService twoFactorService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.twoFactorService = twoFactorService;
    }

    // BƯỚC 1: Đăng nhập (Kiểm tra Email/Pass)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email và mật khẩu không được để trống");
            }

            System.out.println(">>> Login attempt: " + request.getEmail());

            // 1. Xác thực Email & Password với Spring Security
            try {
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                );
                System.out.println(">>> Authentication successful for: " + request.getEmail());
            } catch (BadCredentialsException e) {
                System.err.println(">>> Authentication failed (BadCredentials): " + e.getMessage());
                return ResponseEntity.status(401).body("Sai email hoặc mật khẩu!");
            } catch (UsernameNotFoundException e) {
                System.err.println(">>> Authentication failed (UserNotFound): " + e.getMessage());
                return ResponseEntity.status(401).body("Tài khoản không tồn tại!");
            } catch (Exception e) {
                System.err.println(">>> Authentication failed (Other Exception): " + e.getMessage());
                System.err.println(">>> Exception type: " + e.getClass().getName());
                e.printStackTrace();
                return ResponseEntity.status(401).body("Xác thực thất bại: " + e.getMessage());
            }

            // 2. Tìm User trong DB (auth module)
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        System.err.println(">>> User not found in auth repository: " + request.getEmail());
                        return new IllegalArgumentException("User not found");
                    });

            System.out.println(">>> User found: " + user.getEmail() + ", Role: " + user.getRole());

            // 3. LUÔN YÊU CẦU 2FA - Tạo secret nếu user chưa có
            if (user.getTwoFactorSecret() == null || user.getTwoFactorSecret().isEmpty()) {
                try {
                    // Tạo secret mới cho user chưa có
                    String newSecret = twoFactorService.generateNewSecret();
                    user.setTwoFactorSecret(newSecret);
                    user.setTwoFactorEnabled(true);
                    userRepository.save(user);
                    System.out.println(">>> Generated new 2FA secret for: " + user.getEmail());
                } catch (Exception e) {
                    System.err.println(">>> Error generating 2FA secret: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("Lỗi khi tạo mã 2FA: " + e.getMessage());
                }
            }

            // 4. LUÔN trả về yêu cầu 2FA (không cấp token luôn)
            System.out.println(">>> 2FA required for: " + user.getEmail());
            return ResponseEntity.ok(new AuthResponse(
                null,               // Token chưa có
                null,               // FullName chưa cần
                user.getEmail(),    // Trả email về để client biết đường gửi tiếp bước verify
                null,               // Role chưa cần
                true                // is2faRequired = true (LUÔN true)
            ));
        } catch (IllegalArgumentException e) {
            System.err.println(">>> Login error (IllegalArgument): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Sai email hoặc mật khẩu!");
        } catch (Exception e) {
            System.err.println(">>> Login error (Unexpected Exception): " + e.getMessage());
            System.err.println(">>> Exception type: " + e.getClass().getName());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // BƯỚC 2: Xác thực mã 2FA (Chỉ dùng khi bước 1 trả về is2faRequired=true)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        try {
            if (request.getEmail() == null || request.getCode() == null) {
                return ResponseEntity.badRequest().body("Email và mã OTP không được để trống");
            }

            System.out.println(">>> 2FA verification attempt for: " + request.getEmail());

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        System.err.println(">>> User not found for 2FA verification: " + request.getEmail());
                        return new IllegalArgumentException("User not found");
                    });

            if (user.getTwoFactorSecret() == null || user.getTwoFactorSecret().isEmpty()) {
                System.err.println(">>> User has no 2FA secret: " + request.getEmail());
                return ResponseEntity.badRequest().body("Tài khoản chưa được cấu hình 2FA!");
            }

            // Kiểm tra mã OTP 6 số user gửi lên
            boolean isCodeValid = twoFactorService.isOtpValid(user.getTwoFactorSecret(), request.getCode());

            if (isCodeValid) {
                System.out.println(">>> 2FA verification successful for: " + request.getEmail());
                // Mã đúng -> Cấp Token đăng nhập
                String token = jwtService.generateAccessToken(user.getEmail());
                
                // Convert auth.Role to user.UserRole
                com.upnest.edu.modules.user.entity.UserRole userRole = 
                    com.upnest.edu.modules.user.entity.UserRole.valueOf(user.getRole().toString());
                
                return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getFullName(),
                    user.getEmail(),
                    userRole,
                    false
                ));
            } else {
                System.err.println(">>> 2FA verification failed - Invalid OTP for: " + request.getEmail());
                return ResponseEntity.badRequest().body("Mã OTP không đúng hoặc đã hết hạn!");
            }
        } catch (IllegalArgumentException e) {
            System.err.println(">>> 2FA verification error (IllegalArgument): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Tài khoản không tồn tại!");
        } catch (Exception e) {
            System.err.println(">>> 2FA verification error (Unexpected Exception): " + e.getMessage());
            System.err.println(">>> Exception type: " + e.getClass().getName());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }
}