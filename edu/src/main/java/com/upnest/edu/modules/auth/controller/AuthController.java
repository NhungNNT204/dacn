package com.upnest.edu.modules.auth.controller;

import com.upnest.edu.config.JwtService;
import com.upnest.edu.modules.auth.entity.User;
import com.upnest.edu.modules.auth.payload.AuthResponse;
import com.upnest.edu.modules.auth.payload.LoginRequest;
import com.upnest.edu.modules.auth.payload.VerifyRequest;
import com.upnest.edu.modules.auth.repository.UserRepository;
import com.upnest.edu.modules.auth.service.TwoFactorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            // 1. Xác thực Email & Password với Spring Security
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Tìm User trong DB
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // 3. Kiểm tra xem User có bật bảo mật 2 lớp (2FA) không
            if (user.isTwoFactorEnabled()) {
                // Nếu có -> Trả về thông báo "Cần OTP" (chưa đưa Token vội)
                // Sử dụng Constructor của AuthResponse thay vì builder
                return ResponseEntity.ok(new AuthResponse(
                    null,               // Token chưa có
                    null,               // FullName chưa cần
                    user.getEmail(),    // Trả email về để client biết đường gửi tiếp bước verify
                    null,               // Role chưa cần
                    true                // is2faRequired = true
                ));
            }

            // 4. Nếu không bật 2FA -> Cấp Token luôn
            String token = jwtService.generateToken(user);
            
            // Trả về kết quả thành công dùng Constructor
            return ResponseEntity.ok(new AuthResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                false // is2faRequired = false
            ));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // BƯỚC 2: Xác thực mã 2FA (Chỉ dùng khi bước 1 trả về is2faRequired=true)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Kiểm tra mã OTP 6 số user gửi lên
        boolean isCodeValid = twoFactorService.isOtpValid(user.getTwoFactorSecret(), request.getCode());

        if (isCodeValid) {
            // Mã đúng -> Cấp Token đăng nhập
            String token = jwtService.generateToken(user);
            
            return ResponseEntity.ok(new AuthResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                false
            ));
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không đúng hoặc đã hết hạn!");
        }
    }
}